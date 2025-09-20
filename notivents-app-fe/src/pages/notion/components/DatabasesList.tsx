import type { DatabaseDto } from '@/dtos/database/DatabaseDto'
import { Box, Card, Flex, IconButton, Menu, Portal, SimpleGrid, Status } from '@chakra-ui/react'
import { MdLoop, MdMoreVert, MdOutlineLinkOff } from 'react-icons/md'
import DatabaseTitle from './DatabaseTitle'

interface DatabasesListProps {
  databases: DatabaseDto[]
}

export default function DatabasesList({ databases }: DatabasesListProps) {
  const canBeTracked = (): boolean => {
    return databases.filter(x => x.is_tracked).length + 1 <= 1
  }

  return (
    <SimpleGrid columns={[1, 1, 2, 2, 3]} gap={3} w={'full'}>
      {databases.map(x => (
        <Card.Root size={'sm'}>
          <Card.Body fontSize={'sm'} fontWeight={'medium'}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Flex gap={2} alignItems={'center'}>
                <DatabaseTitle title={x.title} icon={x.icon} />
              </Flex>
              <Flex gap={2} alignItems={'center'}>
                <Status.Root
                  size={'sm'}
                  colorPalette={x.is_tracked ? 'green' : 'blue'}
                  fontSize={'xs'}
                  fontWeight={'normal'}
                  color={'fg.subtle'}
                >
                  {x.is_tracked ? 'Tracked' : 'Linked'}
                  <Status.Indicator />
                </Status.Root>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <IconButton rounded={'full'} variant={'ghost'} size={'xs'} outline={'none'}>
                      <MdMoreVert />
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {x.is_tracked ? (
                          <Menu.Item value="untrack">
                            <MdLoop />
                            <Box flex="1">Set as Untracked</Box>
                          </Menu.Item>
                        ) : (
                          <Menu.Item disabled={!canBeTracked()} value="track">
                            <MdLoop />
                            <Box flex="1">Set as Tracked</Box>
                          </Menu.Item>
                        )}
                        <Menu.Item value="delete" color={'fg.error'}>
                          <MdOutlineLinkOff />
                          <Box flex="1">Remove Link</Box>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}
