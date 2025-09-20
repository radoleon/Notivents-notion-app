import type { UserProfileDto } from '@/dtos/authentication/UserProfileDto'
import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { getUserProfile } from '@/services/authenticationService'
import { supabase } from '@/supabase/supabase'
import { isAxiosError } from 'axios'
import { createContext, useEffect, useRef, useState } from 'react'

type AuthContextType = {
  profile: UserProfileDto | null
  authInitialized: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [authInitialized, setAuthInitialized] = useState<boolean>(false)

  const signOutLock = useRef(false)

  const { setIsLoading } = useLoader()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        signOutLock.current = true
        setProfile(null)
      }
      if (event === 'SIGNED_IN') {
        signOutLock.current = false
        setTimeout(async () => {
          await fetchProfile()
        }, 0)
      }
      if (event === 'INITIAL_SESSION') {
        if (!session) {
          setAuthInitialized(true)
        }
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const data = await getUserProfile()
      if (!signOutLock.current) {
        setProfile(data)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        createToaster('error', error.message)
      }
    } finally {
      setAuthInitialized(true)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ profile, authInitialized }}>{children}</AuthContext.Provider>
  )
}
