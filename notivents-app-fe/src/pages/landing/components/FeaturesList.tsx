import { FEATURES_LIST } from '@/constants/constants'
import { Accordion, Icon, Span } from '@chakra-ui/react'

export default function FeaturesList() {
  return (
    <Accordion.Root variant="subtle" defaultValue={['1']}>
      {FEATURES_LIST.map((feature, index) => (
        <Accordion.Item
          key={feature.id}
          value={feature.id}
          marginBottom={FEATURES_LIST.length - 1 === index ? 0 : 2}
        >
          <Accordion.ItemTrigger paddingBlock={4}>
            <Icon fontSize={'lg'}>{feature.icon({})}</Icon>
            <Span flex={1}>{feature.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{feature.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
