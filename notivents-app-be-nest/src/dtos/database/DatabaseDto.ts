export class DatabaseDto {
  id: string
  notion_database_id: string
  workspace_id: string
  notion_date_property_id: string
  title: string | null
  icon: string | null
  connected_at: Date
  url: string | null
  is_tracked: boolean
}
