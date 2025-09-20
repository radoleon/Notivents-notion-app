import AlertBanner from '@/components/AlertBanner'
import { useLoader } from '@/hooks/useLoader'
import { authorizeNotion } from '@/services/notionService'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function NotionCallbackPage() {
  const [redirectError, setRedirectError] = useState<string | null>(null)

  const { setIsLoading } = useLoader()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code) {
      navigate('.', { replace: true })

      handleCallback(code)
    } else if (error) {
      navigate('.', { replace: true })
      setRedirectError(error)

      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } else {
      navigate('/dashboard')
    }
  }, [])

  const handleCallback = async (code: string): Promise<void> => {
    setIsLoading(true)

    try {
      await authorizeNotion({ code })
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError(error)) {
        setRedirectError(error.message)
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {redirectError && <AlertBanner status="error" message={redirectError} />}
      <p>Redirecting you back...</p>
    </>
  )
}
