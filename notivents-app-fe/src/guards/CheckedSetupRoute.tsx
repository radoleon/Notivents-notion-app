import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { checkUserSetup } from '@/services/setupService'
import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function CheckedSetupRoute() {
  const { setIsLoading } = useLoader()

  const navigate = useNavigate()

  useEffect(() => {
    const initialCheck = async () => {
      setIsLoading(true)

      try {
        const userSetupCheck = await checkUserSetup()

        if (Object.values(userSetupCheck).some(x => !x)) {
          navigate('/dashboard')
        }
      } catch (error) {
        if (isAxiosError(error)) {
          createToaster('error', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initialCheck()
  }, [])

  return <Outlet />
}
