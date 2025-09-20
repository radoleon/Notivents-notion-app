import { Injectable } from '@nestjs/common'
import { endOfMonth, isAfter, min, startOfMonth, subHours } from 'date-fns'
import { SUCCESS } from 'src/constants'
import { TrackedDatabaseDto } from 'src/dtos/database/TrackedDatabaseDto'
import { NotionPageDto } from 'src/dtos/notion/NotionPageDto'
import { SyncPeriod } from 'src/dtos/page/SyncPeriod'
import { PageSyncDto } from 'src/dtos/synchronization/DatabasePagesSync'
import { SynchronizationLogDto } from 'src/dtos/synchronization/SynchronizationLogDto'
import { UpsertPageDto } from 'src/dtos/synchronization/UpsertPageDto'
import { getEventStatus } from 'src/helpers/getEventStatus'
import { TPage } from 'src/models/Page'
import { DatabaseService } from '../database/database.service'
import { NotionService } from '../notion/notion.service'
import { SynchronizationRepository } from './synchronization.repository'

@Injectable()
export class SynchronizationService {
  constructor(
    private readonly _synchronizationRepository: SynchronizationRepository,
    private readonly _databaseService: DatabaseService,
    private readonly _notionService: NotionService
  ) {}

  private async _resolveCommonPages(pages: { database: PageSyncDto; notion: NotionPageDto }[]): Promise<void> {
    const pagesToUpsert: UpsertPageDto[] = []
    const eventsToUpsert: { id: string; event_status_id: number }[] = []

    for (let page of pages) {
      const databasePage = page.database
      const notionPage = page.notion

      const pageToUpsert: UpsertPageDto = {
        id: databasePage.id!,
        synced_at: new Date().toISOString(),
        is_not_found: false
      }

      let dateChanged = false

      if (databasePage.title !== notionPage.title) {
        pageToUpsert.title = page.notion.title
      }
      if (databasePage.date_start !== notionPage.date_start) {
        pageToUpsert.date_start = page.notion.date_start
        dateChanged = true
      }
      if (databasePage.date_end !== notionPage.date_end) {
        pageToUpsert.date_end = page.notion.date_end
        dateChanged = true
      }

      if (dateChanged) {
        eventsToUpsert.push({
          id: databasePage.events[0].id,
          event_status_id: getEventStatus(notionPage)
        })
      }
      pagesToUpsert.push(pageToUpsert)
    }
  }

  private async _resolveOldPages(pages: PageSyncDto[]): Promise<void> {
    await this._synchronizationRepository.updatePageAsNotFound(pages.map(x => x.id))
  }

  private async _resolveNewPages(pages: { databaseId: string; notion: NotionPageDto }[]): Promise<void> {
    const existingPages = await this._synchronizationRepository.getPagesByNotionPageIds(pages.map(x => x.notion.id))
    const exisitngPagesDict: Record<string, TPage> = {}

    existingPages.forEach(x => {
      exisitngPagesDict[x.notion_page_id] = x
    })

    const pagesToInsert: TPage[] = []
    const pagesToUpsert: UpsertPageDto[] = []
    const eventsToUpsert: { id: string; event_status_id: number }[] = []

    for (let page of pages) {
      const existingPage = exisitngPagesDict[page.notion.id]

      if (existingPage) {
        const pageToUpsert: UpsertPageDto = {
          id: existingPage.id!,
          synced_at: new Date().toISOString(),
          is_not_found: false
        }

        let dateChanged = false

        if (existingPage.title !== page.notion.title) {
          pageToUpsert.title = page.notion.title
        }
        if (existingPage.date_start.toISOString() !== page.notion.date_start) {
          pageToUpsert.date_start = page.notion.date_start
          dateChanged = true
        }
        if (existingPage.date_end?.toISOString() !== page.notion.date_end) {
          pageToUpsert.date_end = page.notion.date_end
          dateChanged = true
        }

        if (dateChanged) {
        }

        pagesToUpsert.push(pageToUpsert)
      } else {
        const pageToInsert: TPage = {
          database_id: page.databaseId,
          title: page.notion.title,
          date_start: new Date(page.notion.date_start),
          date_end: page.notion.date_end ? new Date(page.notion.date_end) : null,
          is_not_found: false,
          notion_page_id: page.notion.id,
          url: page.notion.url
        }

        pagesToInsert.push(pageToInsert)
      }
    }
  }

  private async _synchronizePagesWithNotion(
    period: SyncPeriod,
    userId: string,
    trackedDatabases: TrackedDatabaseDto[]
  ) {
    const currentDatabases = await this._synchronizationRepository.getDatabasesWithPagesAndEvents(
      period,
      trackedDatabases.map(x => x.id)
    )

    const commonPages: { database: PageSyncDto; notion: NotionPageDto }[] = []
    const oldPages: PageSyncDto[] = []
    const newPages: { databaseId: string; notion: NotionPageDto }[] = []

    for (let trackedDatabase of trackedDatabases) {
      const currentDatabase = currentDatabases.find(x => x.id === trackedDatabase.id)!

      const currentPages: Record<string, PageSyncDto> = {}
      currentDatabase.pages.forEach(x => (currentPages[x.notion_page_id] = x))

      const notionResponse = await this._notionService.getPagesFromNotion(period, trackedDatabase, userId)

      if (notionResponse.status === SUCCESS) {
        const notionPages = notionResponse.data!
        const notionPagesIds: Set<string> = new Set()

        for (let notionPage of notionPages) {
          notionPagesIds.add(notionPage.id)

          const currentPage = currentPages[notionPage.id]

          if (currentPage) {
            commonPages.push({ database: currentPage, notion: notionPage })
          } else {
            newPages.push({ databaseId: trackedDatabase.id, notion: notionPage })
          }
        }

        for (let currentPageNotionId in currentPages) {
          if (!notionPagesIds.has(currentPageNotionId)) {
            oldPages.push(currentPages[currentPageNotionId])
          }
        }
      } else {
        await this._databaseService.updateDatabaseStatus(trackedDatabase.id, notionResponse.status)
      }
    }

    await Promise.all([
      this._resolveCommonPages(commonPages),
      this._resolveOldPages(oldPages),
      this._resolveNewPages(newPages)
    ])
  }

  public async checkSynchronizationStatus(month: number, year: number, userId: string): Promise<boolean> {
    const period: SyncPeriod = {
      start_date: startOfMonth(new Date(year, month - 1)).toISOString(),
      end_date: endOfMonth(new Date(year, month - 1)).toISOString()
    }

    const trackedDatabases = await this._databaseService.getTrackedDatabases(userId)

    const syncLogs = await this._synchronizationRepository.getSynchronizationLogs(
      period,
      trackedDatabases.map(x => x.id)
    )

    const everySynced = trackedDatabases.every(x => syncLogs.map(x => x.database_id).includes(x.id))
    const oldestSync = min(syncLogs.map(x => x.runned_at!))

    return everySynced && isAfter(oldestSync, subHours(new Date(), 12))
  }

  public async getSynchronizationLogs(
    period: SyncPeriod,
    synchronize: boolean,
    userId: string
  ): Promise<SynchronizationLogDto[]> {
    const trackedDatabases = await this._databaseService.getTrackedDatabases(userId)

    const syncLogs = await this._synchronizationRepository.getSynchronizationLogs(
      period,
      trackedDatabases.map(x => x.id)
    )

    const everySynced = trackedDatabases.every(x => syncLogs.map(x => x.database_id).includes(x.id))
    const oldestSync = min(syncLogs.map(x => x.runned_at!))

    if (everySynced && isAfter(oldestSync, subHours(new Date(), 12)) && !synchronize) {
      return syncLogs
    } else {
      await this._synchronizePagesWithNotion(period, userId, trackedDatabases)
      return syncLogs
    }
  }
}
