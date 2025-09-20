import type { ConfirmResponseDto } from '@/dtos/authentication/ConfirmResponseDto'
import type { PwdRequestDto } from '@/dtos/authentication/PwdRequestDto'
import type { SignupResponseDto } from '@/dtos/authentication/SignupResponseDto'
import type { UserProfileDto } from '@/dtos/authentication/UserProfileDto'
import { extractToken } from '@/helpers/extractToken'
import { supabase } from '@/supabase/supabase'
import axios from 'axios'

export async function signup(signupRequest: PwdRequestDto): Promise<SignupResponseDto> {
  const res = await axios.post('http://localhost:3000/api/auth/signup', signupRequest)
  return res.data
}

export async function login(loginRequest: PwdRequestDto): Promise<ConfirmResponseDto> {
  const { error } = await supabase.auth.signInWithPassword({
    email: loginRequest.email,
    password: loginRequest.password
  })

  if (error) {
    if (error.code === 'email_not_confirmed') {
      const res = await axios.post('http://localhost:3000/api/auth/confirm', loginRequest)
      return res.data
    } else {
      throw error
    }
  }

  return { is_unconfirmed: false }
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function getUserProfile(): Promise<UserProfileDto> {
  const accessToken = await extractToken()

  const res = await axios.get('http://localhost:3000/api/auth', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return res.data
}
