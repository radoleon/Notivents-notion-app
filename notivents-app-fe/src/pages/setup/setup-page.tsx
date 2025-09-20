import Sidebar from '@/components/Sidebar'
import type { CheckResponseDto } from '@/dtos/setup/CheckResponseDto'
import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { checkUserSetup } from '@/services/setupService'
import { Box, Button, Card, Flex, Text } from '@chakra-ui/react'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { MdPeopleAlt } from 'react-icons/md'
import { SiNotion } from 'react-icons/si'
import { useNavigate } from 'react-router'
import DatabasesSelect from '../notion/components/DatabasesSelect'

export default function SetupPage() {
  const [setupCheck, setSetupCheck] = useState<CheckResponseDto | null>(null)

  const { setIsLoading } = useLoader()

  const navigate = useNavigate()

  useEffect(() => {
    const initialCheck = async () => {
      setIsLoading(true)

      try {
        const setupCheckResponse = await checkUserSetup()
        setSetupCheck(setupCheckResponse)

        if (Object.values(setupCheckResponse).every(x => x)) {
          navigate('/dashboard/databases')
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

  const handleAuthorization = async () => {
    window.open(import.meta.env.VITE_NOTION_OAUTH_URL)
  }

  if (!setupCheck) return null

  return (
    <Flex gap={8}>
      <Sidebar isSkeleton={true} />
      {!setupCheck.has_workspace && (
        <Box marginInline={'auto'}>
          <Card.Root maxW={'lg'}>
            <Card.Header>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                Connect Your Notion Workspace
              </Text>
            </Card.Header>
            <Card.Body>
              <Text>
                To continue, please connect your Notion workspace. This will allow us to sync your
                events and provide the best experience.
              </Text>
            </Card.Body>
            <Card.Footer>
              <Button onClick={handleAuthorization}>
                <SiNotion /> Add Workspace
              </Button>
            </Card.Footer>
          </Card.Root>
        </Box>
      )}
      {setupCheck.has_workspace && !setupCheck.is_admin && (
        <Box marginInline={'auto'}>
          <Card.Root maxW={'lg'}>
            <Card.Header>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                Team Collaboration Comming Soon
              </Text>
            </Card.Header>
            <Card.Body>
              <Text>
                This workspace has already been connected by another team member. Please wait until
                collaboration is available to proceed together.
              </Text>
            </Card.Body>
            <Card.Footer>
              <Button disabled>
                <MdPeopleAlt /> Comming Soon
              </Button>
            </Card.Footer>
          </Card.Root>
        </Box>
      )}
      {setupCheck.has_workspace && setupCheck.is_admin && !setupCheck.has_database && (
        <Box width={'full'}>
          <DatabasesSelect />
        </Box>
      )}
    </Flex>
  )
}
