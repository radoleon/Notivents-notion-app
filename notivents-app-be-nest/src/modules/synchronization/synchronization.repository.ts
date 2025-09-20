import { Injectable } from '@nestjs/common'
import { parseISO } from 'date-fns'
import { SyncPeriod } from 'src/dtos/page/SyncPeriod'
import { DatabasePagesSyncDto } from 'src/dtos/synchronization/DatabasePagesSync'
import { SynchronizationLogDto } from 'src/dtos/synchronization/SynchronizationLogDto'
import { TPage } from 'src/models/Page'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class SynchronizationRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}

  public async getSynchronizationLogs(
    period: SyncPeriod,
    trackedDatabasesIds: string[]
  ): Promise<SynchronizationLogDto[]> {
    const { data, error } = await this._supabase.client
      .from('t_synchronizations')
      .select('*')
      .match({
        month: parseISO(period.start_date).getUTCMonth() + 1,
        year: parseISO(period.start_date).getUTCFullYear()
      })
      .in('database_id', trackedDatabasesIds)

    if (error) throw error

    return data
  }

  public async getDatabasesWithPagesAndEvents(
    period: SyncPeriod,
    trackedDatabasesIds: string[]
  ): Promise<DatabasePagesSyncDto[]> {
    const { data, error } = await this._supabase.client
      .from('t_databases')
      .select(
        `
        id, notion_database_id, status, 
        pages:t_pages(
          id, database_id, notion_page_id, title, date_start, date_end, is_not_found,
          events:t_events(
            id, page_id, event_status_id
          )
        )`
      )
      .gte('pages.date_start', period.start_date)
      .lte('pages.date_start', period.end_date)
      .in('id', trackedDatabasesIds)

    if (error) throw error

    return data
  }

  public async updatePageAsNotFound(pageIds: string[]): Promise<void> {
    const { error } = await this._supabase.client.from('t_pages').update({ is_not_found: true }).in('id', pageIds)

    if (error) throw error
  }

  public async getPagesByNotionPageIds(notionPageIds: string[]): Promise<TPage[]> {
    const { data, error } = await this._supabase.client.from('t_pages').select('*').in('notion_page_id', notionPageIds)

    if (error) throw error

    return data
  }
}
