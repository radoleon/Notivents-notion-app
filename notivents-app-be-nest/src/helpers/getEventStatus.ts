import { NotionPageDto } from 'src/dtos/notion/NotionPageDto'

export function getEventStatus(page: NotionPageDto): number {
  const now = new Date()
  const start = new Date(page.date_start)
  let end: Date | null

  let event_status_id = 1

  if (page.date_end) {
    end = new Date(page.date_end)
  } else {
    end = new Date(page.date_start)
    end.setHours(23, 59, 59, 999)
  }

  if (start > now) {
    event_status_id = 1
  } else if ((!end && start <= now) || (end && start <= now && end > now)) {
    event_status_id = 2
  } else if ((end && end <= now) || (!end && start < now)) {
    event_status_id = 3
  }

  return event_status_id
}
