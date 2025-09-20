import type { NotionDatabaseDto } from '@/dtos/notion/NotionDatabaseDto'
import { Alert, Button, Dialog, Portal, VStack } from '@chakra-ui/react'

interface DatePropertyDialogProps {
  open: boolean
  selectDialogData: NotionDatabaseDto | null
  handleDialogSelect: (databaseId: string, propertyId: string) => void
  handleDialogClose: () => void
}

export default function DatePropertyDialog({
  open,
  selectDialogData,
  handleDialogSelect,
  handleDialogClose
}: DatePropertyDialogProps) {
  return (
    <Dialog.Root
      open={open}
      placement={'center'}
      size={'xs'}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => handleDialogClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header justifyContent={'center'}>
              <Dialog.Title>Select Date Property</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={2}>
                {selectDialogData &&
                  selectDialogData.date_properties.map(x => (
                    <Button
                      key={x.notion_property_id}
                      onClick={() =>
                        handleDialogSelect(
                          selectDialogData.notion_database_id,
                          x.notion_property_id
                        )
                      }
                      w={'full'}
                      variant={'outline'}
                      size="xs"
                      justifyContent={'start'}
                    >
                      {x.title}
                    </Button>
                  ))}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Alert.Root status="info" colorPalette="gray" size="sm">
                <Alert.Indicator />
                <Alert.Description>
                  This property will represent the date of your events
                </Alert.Description>
              </Alert.Root>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
