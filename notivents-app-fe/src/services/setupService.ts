import type { CheckResponseDto } from '@/dtos/setup/CheckResponseDto'
import { extractToken } from '@/helpers/extractToken'
import axios from 'axios'

export async function checkUserSetup(): Promise<CheckResponseDto> {
  const accessToken = await extractToken()

  const res = await axios.get('http://localhost:3000/api/setup/check', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return res.data
}
