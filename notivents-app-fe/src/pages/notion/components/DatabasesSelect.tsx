import type { AddDatabaseRequestDto } from '@/dtos/database/AddDatabaseRequestDto'
import type { NotionDatabaseDto } from '@/dtos/notion/NotionDatabaseDto'
import { Tooltip } from '@/generated/tooltip'
import { createToaster } from '@/helpers/createToaster'
import { useLoader } from '@/hooks/useLoader'
import { getDatabasesFromNotion } from '@/services/notionService'
import {
  ActionBar,
  Alert,
  Button,
  CheckboxCard,
  Circle,
  CloseButton,
  Flex,
  Heading,
  Portal,
  Progress,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import { isAxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineCloudUpload } from 'react-icons/md'
import DatabaseTitle from './DatabaseTitle'
import DatePropertyDialog from './DatePropertyDialog'
import TrackedDatabasesDialog from './TrackedDatabasesDialog'

export default function DatabasesSelect() {
  const [notionDatabases, setNotionDatabases] = useState<NotionDatabaseDto[]>([])
  const [notionDatabasesDict, setNotionDatabasesDict] = useState<Record<string, NotionDatabaseDto>>(
    {}
  )

  const [selectedDatabases, setSelectedDatabases] = useState<AddDatabaseRequestDto[]>([])

  const [openPropertyDialog, setOpenPropertyDialog] = useState(false)
  const [openTrackedDatabasesDialog, setOpenTrackedDatabasesDialog] = useState(false)

  const [selectDialogData, setSelectDialogData] = useState<NotionDatabaseDto | null>(null)

  const { setIsLoading } = useLoader()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getDatabasesFromNotion()
        setNotionDatabases(data)
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

  useEffect(() => {
    if (notionDatabases.length) {
      const dict: Record<string, NotionDatabaseDto> = {}

      notionDatabases.forEach(x => {
        dict[x.notion_database_id] = x
      })

      setNotionDatabasesDict(dict)
    }
  }, [notionDatabases])

  const notionDatabasesSelected = useMemo(() => {
    return selectedDatabases.map(x => notionDatabasesDict[x.notion_database_id])
  }, [notionDatabasesDict, selectedDatabases])

  const handleCheckedChange = (databaseId: string) => {
    if (selectedDatabases.map(x => x.notion_database_id).includes(databaseId)) {
      setSelectedDatabases(prev => prev.filter(x => x.notion_database_id !== databaseId))
    } else {
      const notionDatabase = notionDatabasesDict[databaseId]

      const dateDatabaseProperties = notionDatabase.date_properties

      if (dateDatabaseProperties.length === 1) {
        setSelectedDatabases(prev => [
          ...prev,
          {
            notion_database_id: databaseId,
            date_property_id: dateDatabaseProperties[0].notion_property_id,
            is_tracked: false
          }
        ])
      } else {
        setSelectDialogData(notionDatabase)
        setOpenPropertyDialog(true)
      }
    }
  }

  const handleDialogSelect = (databaseId: string, propertyId: string) => {
    setSelectedDatabases(prev => [
      ...prev,
      { notion_database_id: databaseId, date_property_id: propertyId, is_tracked: false }
    ])
    setOpenPropertyDialog(false)
  }

  const handlePropertyDialogClose = () => {
    setSelectDialogData(null)
  }

  const handleTrackedDatabasesDialogClose = () => {
    setOpenTrackedDatabasesDialog(false)
    setSelectedDatabases(prev => prev.map(x => ({ ...x, isTracked: false })))
  }

  const toggleTracked = (databaseId: string) => {
    setSelectedDatabases(prev =>
      prev.map(x => (x.notion_database_id === databaseId ? { ...x, isTracked: !x.is_tracked } : x))
    )
  }

  const isDisabledDueToCount = (databaseId: string): boolean => {
    if (selectedDatabases.length >= 3) {
      if (selectedDatabases.map(x => x.notion_database_id).includes(databaseId)) {
        return false
      } else {
        return true
      }
    }
    return false
  }

  if (notionDatabases.length === 0) {
    return <div>Add databases to continue.</div>
  }

  return (
    <>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={8}>
        <Heading as={'h3'}>Select Databases You Want to Link</Heading>
        <Flex alignItems={'center'} gap={2}>
          <Progress.Root
            min={0}
            max={3}
            width={'50px'}
            value={selectedDatabases.length}
            size={'xs'}
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Text fontSize={'sm'} color={'fg.subtle'}>
            {selectedDatabases.length + '/' + 3}
          </Text>
        </Flex>
      </Flex>
      <Alert.Root status="info" colorPalette="gray" size="sm" mb={8}>
        <Alert.Indicator />
        <Alert.Description>
          Select databases you want to link with Notion, we will store information about these
          databases for future use
        </Alert.Description>
      </Alert.Root>
      <SimpleGrid columns={[1, 1, 2, 2, 3]} gap={3} w={'full'}>
        {notionDatabases.map(x => (
          <CheckboxCard.Root
            key={x.notion_database_id}
            checked={selectedDatabases.map(y => y.notion_database_id).includes(x.notion_database_id)}
            onCheckedChange={() => handleCheckedChange(x.notion_database_id)}
            disabled={!x.date_properties.length || isDisabledDueToCount(x.notion_database_id)}
            size={'md'}
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content overflow={'hidden'}>
                <CheckboxCard.Label truncate>
                  <DatabaseTitle title={x.title} icon={x.icon} />
                </CheckboxCard.Label>
              </CheckboxCard.Content>
              {x.date_properties.length ? (
                <CheckboxCard.Indicator />
              ) : (
                <Tooltip
                  content="This database has no date properties"
                  showArrow={true}
                  openDelay={300}
                  closeDelay={100}
                >
                  <Circle size={5} bg="bg.emphasized" color={'fg.muted'} cursor={'pointer'}>
                    ?
                  </Circle>
                </Tooltip>
              )}
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        ))}
      </SimpleGrid>

      <ActionBar.Root open={selectedDatabases.length !== 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selectedDatabases.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button size="sm" onClick={() => setOpenTrackedDatabasesDialog(true)}>
                <MdOutlineCloudUpload />
                Save
              </Button>
              <CloseButton
                size="sm"
                colorPalette={'red'}
                variant={'subtle'}
                onClick={() => setSelectedDatabases([])}
              />
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>

      <DatePropertyDialog
        open={openPropertyDialog}
        selectDialogData={selectDialogData}
        handleDialogClose={handlePropertyDialogClose}
        handleDialogSelect={handleDialogSelect}
      />

      <TrackedDatabasesDialog
        open={openTrackedDatabasesDialog}
        notionDatabasesSelected={notionDatabasesSelected}
        submitDialogData={selectedDatabases}
        handleDialogClose={handleTrackedDatabasesDialogClose}
        toggleTracked={toggleTracked}
      />
    </>
  )
}
