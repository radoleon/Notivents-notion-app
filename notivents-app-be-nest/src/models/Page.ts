export interface TPage {
  id?: string
  database_id: string
  title: string | null
  date_start: Date
  date_end: Date | null
  synced_at?: Date
  is_not_found: boolean
  notion_page_id: string
  url: string | null
}
