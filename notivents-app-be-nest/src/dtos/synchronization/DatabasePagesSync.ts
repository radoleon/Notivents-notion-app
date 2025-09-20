export class DatabasePagesSyncDto {
  id: string
  notion_database_id: string
  status: string | null
  pages: PageSyncDto[]
}

export class PageSyncDto {
  id: string
  database_id: string
  notion_page_id: string
  title: string | null
  date_start: string
  date_end: string | null
  is_not_found: boolean
  events: EventSyncDto[]
}

export class EventSyncDto {
  id: string
  page_id: string
  event_status_id: number
}
