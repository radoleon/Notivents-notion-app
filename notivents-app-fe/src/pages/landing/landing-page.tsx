import { Box, Flex, Heading } from '@chakra-ui/react'
import CallToAction from './components/CallToAction'
import FeaturesList from './components/FeaturesList'
import Testimonial from './components/Testimonial'
import TimelineList from './components/TimelineList'

export default function LandingPage() {
  return (
    <>
      <CallToAction />
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={'start'}
        gap={{ base: 8, md: 16 }}
        marginBottom={16}
      >
        <FeaturesList />
        <Box width={{ base: 'full', md: 'auto' }} marginInline={'auto'}>
          <Heading
            size={'xl'}
            marginBottom={8}
            display={{ base: 'block', md: 'none' }}
            textAlign={'center'}
          >
            How to get started?
          </Heading>
          <TimelineList />
          <Testimonial />
        </Box>
      </Flex>
    </>
  )
}
