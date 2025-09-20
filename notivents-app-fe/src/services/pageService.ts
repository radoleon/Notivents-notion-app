import type { GetPagesRequestDto } from '@/dtos/page/GetPagesRequestDto'
import type { DatabasePagesSyncDto } from '@/dtos/synchronization/DatabasePagesSync'
import { extractToken } from '@/helpers/extractToken'
import axios from 'axios'

export async function getPagesWithEvents(
  pagesRequest: GetPagesRequestDto
): Promise<DatabasePagesSyncDto[]> {
  const accessToken = await extractToken()

  const res = await axios.post('http://localhost:3000/api/page', pagesRequest, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return res.data
}
