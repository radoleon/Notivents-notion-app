export interface TDatabase {
  id?: string
  notion_database_id: string
  workspace_id: string
  notion_date_property_id: string
  icon: string | null
  title: string | null
  connected_at?: Date
  url: string | null
  is_tracked: boolean
}
