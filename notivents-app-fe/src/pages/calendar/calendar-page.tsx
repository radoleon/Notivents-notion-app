import { getPagesWithEvents } from '@/services/pageService'
import {
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  SegmentGroup,
  Switch,
  Text
} from '@chakra-ui/react'
import { addMonths, format, getMonth, getYear, startOfMonth, subMonths } from 'date-fns'
import { useEffect, useState } from 'react'
import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdCalendarViewMonth,
  MdList,
  MdSearch
} from 'react-icons/md'
import CalendarView from './components/CalendarView'
import ListView from './components/ListView'

export default function CalendarPage() {
  const today = new Date()

  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const thisMonth = () => setCurrentMonth(startOfMonth(today))

  useEffect(() => {
    const fetchData = async () => {
      await getPagesWithEvents({
        month: getMonth(today),
        year: getYear(today),
        synchronize: false
      })
    }

    fetchData()
  })

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'center'} mb={4}>
        <SegmentGroup.Root
          size={'xs'}
          value={selectedView}
          onValueChange={e => setSelectedView(e.value as 'calendar' | 'list')}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            cursor={'pointer'}
            items={[
              {
                value: 'calendar',
                label: (
                  <HStack>
                    <MdCalendarViewMonth />
                    Calendar View
                  </HStack>
                )
              },
              {
                value: 'list',
                label: (
                  <HStack>
                    <MdList />
                    List View
                  </HStack>
                )
              }
            ]}
          />
        </SegmentGroup.Root>
        <Flex alignItems={'center'} gap={4}>
          <Switch.Root size={'sm'}>
            <Switch.Label fontSize={'xs'} fontWeight={'normal'} color={'fg.muted'}>
              Only Planned
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>
          <IconButton size="xs" variant="ghost" onClick={prevMonth}>
            <MdArrowBackIosNew />
          </IconButton>
          <Text
            fontWeight="medium"
            fontSize="sm"
            minW={110}
            textAlign={'center'}
            _hover={{ color: 'fg.subtle' }}
            transition={'color 200ms'}
            cursor={'pointer'}
            onClick={thisMonth}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <IconButton size="xs" variant="ghost" onClick={nextMonth}>
            <MdArrowForwardIos />
          </IconButton>
        </Flex>
      </Flex>
      <InputGroup
        flex="1"
        mb={8}
        startElement={<MdSearch />}
        endElement={<CloseButton size="xs" variant="plain" me={-3} />}
      >
        <Input size={'xs'} variant={'flushed'} placeholder="Search events" />
      </InputGroup>
      {selectedView === 'calendar' ? <CalendarView currentMonth={currentMonth} /> : <ListView />}
    </>
  )
}
