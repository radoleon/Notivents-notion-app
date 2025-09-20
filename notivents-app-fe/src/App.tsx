import { Container } from '@chakra-ui/react'
import { Outlet } from 'react-router'
import LoaderOverlay from './components/LoaderOverlay'
import Navigation from './components/Navigation'
import { Toaster } from './generated/toaster'
import { useAuth } from './hooks/useAuth'
import { useLoader } from './hooks/useLoader'

export default function App() {
  const { isLoading } = useLoader()
  const { authInitialized } = useAuth()

  if (!authInitialized) {
    return null
  }

  return (
    <>
      {isLoading && <LoaderOverlay />}
      <Container position={'relative'} minHeight={'100vh'} paddingBottom={4}>
        <Navigation />
        <Outlet />
      </Container>
      <Toaster />
    </>
  )
}
