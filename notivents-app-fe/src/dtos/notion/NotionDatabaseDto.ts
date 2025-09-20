import { NotionPropertyDto } from './NotionPropertyDto'

export class NotionDatabaseDto {
  notion_database_id: string
  url: string | null
  title: string | null
  icon: string | null
  date_properties: NotionPropertyDto[]
}
