import { Box, Circle, Grid } from '@chakra-ui/react'
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarViewProps {
  currentMonth: Date
}

export default function CalendarView({ currentMonth }: CalendarViewProps) {
  const today = new Date()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: Date[] = []
  let day = weekStart
  while (day <= weekEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" mb={2}>
        {WEEKDAYS.map(day => (
          <Box key={day} textAlign="center" fontWeight="medium" color="fg.muted" fontSize="sm">
            {day}
          </Box>
        ))}
      </Grid>
      <Grid templateColumns="repeat(7, 1fr)" rounded={'md'}>
        {days.map((date, i) => (
          <Box
            key={i}
            minH={24}
            color={isSameMonth(date, currentMonth) ? 'fg' : 'fg.subtle'}
            bg={'bg.subtle'}
            p={2}
            boxShadow={'xs'}
          >
            <Circle
              size={5}
              fontSize={'xs'}
              rounded={'full'}
              mb={1}
              color={isSameDay(date, today) ? 'white' : undefined}
              bg={isSameDay(date, today) ? 'red' : undefined}
            >
              {format(date, 'd')}
            </Circle>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}
