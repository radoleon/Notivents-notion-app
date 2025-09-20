import type { NotionStatus } from '@/constants/constants'

export class NotionResponseWrapper<T> {
  status: NotionStatus
  data: T | null
}
