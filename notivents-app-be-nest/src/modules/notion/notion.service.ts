import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, isNotionClientError } from '@notionhq/client'
import { NotionStatus, RATE_LIMITED, RESTRICTED_RESOURCE, SUCCESS, UNAUTHORIZED, VALIDATION_ERROR } from 'src/constants'
import { TrackedDatabaseDto } from 'src/dtos/database/TrackedDatabaseDto'
import { NotionDatabaseDto } from 'src/dtos/notion/NotionDatabaseDto'
import { NotionPageDto } from 'src/dtos/notion/NotionPageDto'
import { NotionResponseWrapper } from 'src/dtos/notion/NotionResponseWrapper'
import { SyncPeriod } from 'src/dtos/page/SyncPeriod'
import { HttpFactory } from 'src/http/http.factory'
import { NotionMapper } from './notion.mapper'
import { NotionRepository } from './notion.respository'

@Injectable()
export class NotionService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _http: HttpFactory,
    private readonly _notionRepository: NotionRepository,
    private readonly _mapper: NotionMapper
  ) {}

  private async _handleRetryAfter<T>(fn: () => Promise<NotionResponseWrapper<T>>): Promise<NotionResponseWrapper<T>> {
    try {
      return await fn()
    } catch (retryAfterError) {
      if (isNotionClientError(retryAfterError)) {
        if ([VALIDATION_ERROR, UNAUTHORIZED, RESTRICTED_RESOURCE].includes(retryAfterError.code)) {
          return {
            status: retryAfterError.code as NotionStatus,
            data: null
          }
        }
      }

      throw retryAfterError
    }
  }

  private async _withRetryAfter<T>(fn: () => Promise<NotionResponseWrapper<T>>): Promise<NotionResponseWrapper<T>> {
    try {
      return await fn()
    } catch (error) {
      if (isNotionClientError(error)) {
        if (error.code === RATE_LIMITED) {
          const timeout = parseInt(error.headers?.['retry-after'] || '1')
          await new Promise(resolve => setTimeout(resolve, timeout * 1000))

          return await this._handleRetryAfter<T>(fn)
        }
        if ([VALIDATION_ERROR, UNAUTHORIZED, RESTRICTED_RESOURCE].includes(error.code)) {
          return {
            status: error.code as NotionStatus,
            data: null
          }
        }
      }

      throw error
    }
  }

  public async exchangeOAuthCodeForWorkspace(code: string, userId: string): Promise<void> {
    if (await this._notionRepository.hasUserWorkspaceToken(userId)) {
      throw new ForbiddenException()
    }

    const notionOAuthClient = this._configService.get<string>('NOTION_OAUTH_CLIENT_ID')
    const notionOAuthSecret = this._configService.get<string>('NOTION_OAUTH_CLIENT_SECRET')
    const notionRedirectUri = this._configService.get<string>('NOTION_OAUTH_REDIRECT_URI')

    const encoded = btoa(`${notionOAuthClient}:${notionOAuthSecret}`)

    const res = await this._http.client.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: notionRedirectUri
      },
      { headers: { Authorization: `Basic ${encoded}` } }
    )

    const accessResponse = res.data

    if (accessResponse.error) {
      throw new InternalServerErrorException()
    }

    await this._notionRepository.addWorkspaceFromNotionOAuthResponse(userId, accessResponse)
  }

  public async getDatabasesFromNotion(userId: string): Promise<NotionResponseWrapper<NotionDatabaseDto[]>> {
    const userAccessToken = await this._notionRepository.getNotionAccessTokenByUserId(userId)

    const notionClient = new Client({ auth: userAccessToken })

    return await this._withRetryAfter<NotionDatabaseDto[]>(async () => {
      const databasesFromNotion = await notionClient.search({
        filter: { value: 'database', property: 'object' }
      })

      return {
        status: SUCCESS,
        data: this._mapper.notionDatabasesToResponse(databasesFromNotion.results)
      }
    })
  }

  public async getPagesFromNotion(
    period: SyncPeriod,
    database: TrackedDatabaseDto,
    userId: string
  ): Promise<NotionResponseWrapper<NotionPageDto[]>> {
    const userAccessToken = await this._notionRepository.getNotionAccessTokenByUserId(userId)

    const notionClient = new Client({ auth: userAccessToken })

    const filter = {
      and: [
        {
          property: database.notion_date_property_id,
          date: { on_or_after: period.start_date }
        },
        {
          property: database.notion_date_property_id,
          date: { on_or_before: period.end_date }
        }
      ]
    }

    return await this._withRetryAfter<NotionPageDto[]>(async () => {
      const pagesFromNotion = await notionClient.databases.query({
        database_id: database.notion_database_id,
        filter: filter
      })

      return {
        status: SUCCESS,
        data: this._mapper.notionPagesToResponse(pagesFromNotion.results, database.notion_date_property_id)
      }
    })
  }
}
