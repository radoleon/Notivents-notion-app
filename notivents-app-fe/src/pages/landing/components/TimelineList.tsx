import { TIMELINE_LIST } from '@/constants/constants'
import { Timeline } from '@chakra-ui/react'

export default function TimelineList() {
  return (
    <Timeline.Root>
      {TIMELINE_LIST.map(item => (
        <Timeline.Item key={item.id}>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>{item.id}</Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>{item.title}</Timeline.Title>
            <Timeline.Description>{item.description}</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}
