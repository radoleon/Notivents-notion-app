import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { AddDatabasesRequestWrapper } from 'src/dtos/database/AddDatabasesRequestWrapper'
import { GetWorkspaceResponseDto } from 'src/dtos/database/GetWorkspaceResponseDto'
import { TrackedDatabaseDto } from 'src/dtos/database/TrackedDatabaseDto'
import { NotionDatabaseDto } from 'src/dtos/notion/NotionDatabaseDto'
import { TDatabase } from 'src/models/Database'
import { NotionService } from '../notion/notion.service'
import { DatabaseRepository } from './database.repository'

@Injectable()
export class DatabaseService {
  constructor(
    private readonly _notionService: NotionService,
    private readonly _databaseRepository: DatabaseRepository
  ) {}

  public async addDatabases(request: AddDatabasesRequestWrapper, userId: string): Promise<void> {
    const isAnyTracked = request.data.some(x => x.is_tracked)

    if (!isAnyTracked || (await this._databaseRepository.hasUserAnyDatabase(userId))) {
      throw new ForbiddenException()
    }

    const notionDatabases = (await this._notionService.getDatabasesFromNotion(userId)).data!
    const notionDatabasesDictionary: Record<string, NotionDatabaseDto> = {}

    notionDatabases.forEach(x => {
      notionDatabasesDictionary[x.notion_database_id] = x
    })

    const requestDatabases = request.data

    for (const requestDatabase of requestDatabases) {
      const notionDatabase = notionDatabasesDictionary[requestDatabase.notion_database_id]

      if (!notionDatabase) {
        throw new BadRequestException()
      }

      const notionProperty = notionDatabase.date_properties.find(
        x => x.notion_property_id === requestDatabase.date_property_id
      )

      if (!notionProperty) {
        throw new BadRequestException()
      }
    }

    const workspaceId = await this._databaseRepository.getWorkspaceIdByUserId(userId)

    const databasesToAdd: TDatabase[] = []

    for (const requestDatabase of requestDatabases) {
      const notionDatabase = notionDatabasesDictionary[requestDatabase.notion_database_id]

      databasesToAdd.push({
        notion_database_id: requestDatabase.notion_database_id,
        workspace_id: workspaceId,
        notion_date_property_id: requestDatabase.date_property_id,
        icon: notionDatabase.icon,
        title: notionDatabase.title,
        url: notionDatabase.url,
        is_tracked: requestDatabase.is_tracked
      })
    }

    await this._databaseRepository.addDatabases(databasesToAdd)
  }

  public async getWorkspaceWithDatabases(userId: string): Promise<GetWorkspaceResponseDto> {
    const workspaceId = await this._databaseRepository.getWorkspaceIdByUserId(userId)
    const workspaceResponse = await this._databaseRepository.getWorkspaceWithDatabases(workspaceId)

    if (workspaceResponse.databases.length === 0) {
      throw new BadRequestException()
    }

    return workspaceResponse
  }

  public async getTrackedDatabases(userId: string): Promise<TrackedDatabaseDto[]> {
    const workspaceId = await this._databaseRepository.getWorkspaceIdByUserId(userId)

    return await this._databaseRepository.getTrackedDatabasesByWorkspaceId(workspaceId)
  }

  public async updateDatabaseStatus(databaseId: string, status: string): Promise<void> {
    await this._databaseRepository.updateDatabaseStatus(databaseId, status)
  }
}
