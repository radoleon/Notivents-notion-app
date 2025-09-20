import type { AddDatabaseRequestDto } from '@/dtos/database/AddDatabaseRequestDto'
import type { NotionDatabaseDto } from '@/dtos/notion/NotionDatabaseDto'
import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { addDatabases } from '@/services/databaseService'
import {
  Alert,
  Button,
  CheckboxCard,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Progress,
  Switch,
  Text,
  VStack
} from '@chakra-ui/react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router'
import DatabaseTitle from './DatabaseTitle'

interface DatePropertyDialogProps {
  open: boolean
  notionDatabasesSelected: NotionDatabaseDto[]
  submitDialogData: AddDatabaseRequestDto[]
  handleDialogClose: () => void
  toggleTracked: (databaseId: string) => void
}

export default function TrackedDatabasesDialog({
  open,
  notionDatabasesSelected,
  submitDialogData,
  handleDialogClose,
  toggleTracked
}: DatePropertyDialogProps) {
  const { setIsLoading } = useLoader()

  const navigate = useNavigate()

  const isDisabledDueToCount = (databaseId: string) => {
    if (submitDialogData.filter(x => x.is_tracked).length >= 1) {
      if (submitDialogData.find(x => x.notion_database_id === databaseId)?.is_tracked) {
        return false
      } else {
        return true
      }
    }
    return false
  }

  const getDatabaseObjectById = (databaseId: string) => {
    return notionDatabasesSelected.find(x => x.notion_database_id === databaseId)!
  }

  const handleAddDatabases = async () => {
    setIsLoading(true)
    try {
      await addDatabases({ data: submitDialogData })
      navigate('/dashboard/databases')
    } catch (error) {
      if (isAxiosError(error)) {
        createToaster('error', error.message)
      }
    } finally {
      setIsLoading(false)
      handleDialogClose()
    }
  }

  return (
    <Dialog.Root
      open={open}
      placement={'center'}
      size={'md'}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      scrollBehavior={'inside'}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header justifyContent={'center'}>
              <Dialog.Title>Select Tracked Databases</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex alignItems={'center'} justifyContent={'end'} gap={2} mb={8}>
                <Progress.Root
                  min={0}
                  max={1}
                  width={'50px'}
                  value={submitDialogData.filter(x => x.is_tracked).length}
                  size={'xs'}
                >
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Text fontSize={'sm'} color={'fg.subtle'}>
                  {submitDialogData.filter(x => x.is_tracked).length + '/' + 1}
                </Text>
              </Flex>
              <VStack gap={2} alignItems={'stretch'}>
                {submitDialogData.map(x => (
                  <CheckboxCard.Root
                    key={x.notion_database_id}
                    disabled={isDisabledDueToCount(x.notion_database_id)}
                    size={'md'}
                  >
                    <CheckboxCard.Control>
                      <CheckboxCard.Content overflow={'hidden'}>
                        <CheckboxCard.Label truncate>
                          <DatabaseTitle
                            title={getDatabaseObjectById(x.notion_database_id).title}
                            icon={getDatabaseObjectById(x.notion_database_id).icon}
                          />
                        </CheckboxCard.Label>
                      </CheckboxCard.Content>
                      <Switch.Root
                        size={'sm'}
                        checked={x.is_tracked}
                        onCheckedChange={() => toggleTracked(x.notion_database_id)}
                        disabled={isDisabledDueToCount(x.notion_database_id)}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                      </Switch.Root>
                    </CheckboxCard.Control>
                  </CheckboxCard.Root>
                ))}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer flexDirection={'column'}>
              <Alert.Root status="info" colorPalette="gray" size="sm">
                <Alert.Indicator />
                <Alert.Description>
                  These databases will be tracked during synchronizations with Notion
                </Alert.Description>
              </Alert.Root>
              <Button
                mt={4}
                onClick={handleAddDatabases}
                disabled={submitDialogData.every(x => !x.is_tracked)}
              >
                <Text>Add Databases</Text>
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild onClick={handleDialogClose}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
