export class UpsertPageDto {
  id: string
  title?: string | null
  date_start?: string
  date_end?: string | null
  synced_at: string
  is_not_found: boolean
}
