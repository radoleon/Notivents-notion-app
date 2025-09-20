import type { NotionDatabaseDto } from '@/dtos/notion/NotionDatabaseDto'
import type { OAuthRequestDto } from '@/dtos/notion/OAuthRequestDto'
import { extractToken } from '@/helpers/extractToken'
import axios from 'axios'

export async function authorizeNotion(codeRequest: OAuthRequestDto): Promise<void> {
  const accessToken = await extractToken()

  await axios.post('http://localhost:3000/api/notion/callback', codeRequest, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getDatabasesFromNotion(): Promise<NotionDatabaseDto[]> {
  const accessToken = await extractToken()

  const res = await axios.get('http://localhost:3000/api/notion/databases', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return res.data
}
