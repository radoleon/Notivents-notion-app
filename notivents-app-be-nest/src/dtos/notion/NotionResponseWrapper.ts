import { NotionStatus } from 'src/constants'

export class NotionResponseWrapper<T> {
  status: NotionStatus
  data: T | null
}
