import { DatabaseDto } from './DatabaseDto'

export class GetWorkspaceResponseDto {
  id: string
  notion_workspace_id: string
  title: string | null
  icon: string | null
  databases: DatabaseDto[]
}
