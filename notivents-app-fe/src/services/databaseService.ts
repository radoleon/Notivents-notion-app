import type { AddDatabasesRequestWrapper } from '@/dtos/database/AddDatabasesRequestWrapper'
import type { GetWorkspaceResponseDto } from '@/dtos/database/GetWorkspaceResponseDto'
import { extractToken } from '@/helpers/extractToken'
import axios from 'axios'

export async function addDatabases(databasesRequest: AddDatabasesRequestWrapper): Promise<void> {
  const accessToken = await extractToken()

  await axios.post('http://localhost:3000/api/database', databasesRequest, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getWorkspaceWithDatabases(): Promise<GetWorkspaceResponseDto> {
  const accessToken = await extractToken()

  const res = await axios.get('http://localhost:3000/api/database/workspace', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return res.data
}
