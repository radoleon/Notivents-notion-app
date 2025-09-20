import { supabase } from '@/supabase/supabase'

export async function extractToken(): Promise<string | undefined> {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) throw error

  return session?.access_token
}
