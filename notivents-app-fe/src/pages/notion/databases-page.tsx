import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { getWorkspaceWithDatabases } from '@/services/databaseService'
import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Progress,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text
} from '@chakra-ui/react'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { MdPeopleAlt } from 'react-icons/md'
import DatabasesList from './components/DatabasesList'
import type { GetWorkspaceResponseDto } from '@/dtos/database/GetWorkspaceResponseDto'

export default function DatabasesPage() {
  const [workspace, setWorkspace] = useState<GetWorkspaceResponseDto | null>(null)

  const { setIsLoading } = useLoader()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const data = await getWorkspaceWithDatabases()
        setWorkspace(data)
      } catch (error) {
        if (isAxiosError(error)) {
          createToaster('error', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    workspace && (
      <>
        <Flex mb={8} justifyContent={'space-between'} alignItems={'center'}>
          <Heading as={'h3'} m={0}>
            Linked Databases With
            <Text ms={2} as={'span'} color={'fg.subtle'}>
              {workspace.title}
            </Text>
          </Heading>

          <Button size={'xs'} colorPalette={'blue'}>
            Change
          </Button>
        </Flex>
        <DatabasesList databases={workspace.databases} />
        <Flex gap={4} my={8} justifyContent={'end'}>
          <Flex alignItems={'center'} gap={2}>
            <Text fontSize={'xs'} color={'fg.subtle'}>
              Linked Databases
            </Text>
            <Progress.Root
              min={0}
              max={3}
              width={'50px'}
              value={workspace.databases.length}
              size={'xs'}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text fontSize={'sm'} color={'fg.subtle'}>
              {workspace.databases.length + '/' + 3}
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={2}>
            <Text fontSize={'xs'} color={'fg.subtle'}>
              Tracked Databases
            </Text>
            <Progress.Root
              min={0}
              max={1}
              width={'50px'}
              value={workspace.databases.filter(x => x.is_tracked).length}
              size={'xs'}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text fontSize={'sm'} color={'fg.subtle'}>
              {workspace.databases.filter(x => x.is_tracked).length + '/' + 1}
            </Text>
          </Flex>
        </Flex>
        <Card.Root>
          <Card.Header>
            <Text fontSize={'md'} fontWeight={'bold'}>
              Workspace Members
            </Text>
          </Card.Header>
          <Card.Body>
            <HStack gap={4} mb={4}>
              <SkeletonCircle size={8} />
              <Stack flex={1}>
                <Skeleton height={3} width={'200px'} />
                <Skeleton height={2} width={'80px'} />
              </Stack>
            </HStack>
            <HStack gap={4}>
              <SkeletonCircle size={8} />
              <Stack flex={1}>
                <Skeleton height={3} width={'200px'} />
                <Skeleton height={2} width={'80px'} />
              </Stack>
            </HStack>
          </Card.Body>
          <Card.Footer>
            <Button size={'xs'} variant={'subtle'} disabled>
              <MdPeopleAlt /> Comming Soon
            </Button>
          </Card.Footer>
        </Card.Root>
      </>
    )
  )
}
