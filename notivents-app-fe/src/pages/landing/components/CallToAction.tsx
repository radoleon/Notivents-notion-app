import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { SiNotion } from 'react-icons/si'
import { Link } from 'react-router'

export default function CallToAction() {
  return (
    <Box bgImage={`url('/bg_texture.svg')`} bgSize={'cover'} paddingBlock={8} marginBlock={8}>
      <Heading as="h1" size={'4xl'} textAlign={'center'} maxWidth={'30ch'} marginInline={'auto'}>
        Turn Your Notion Workspace into a Powerful Event Platform
      </Heading>
      <Text
        fontSize={'lg'}
        maxWidth={'80ch'}
        marginInline={'auto'}
        textAlign={'center'}
        marginTop={8}
      >
        Seamlessly sync your events from Notion, customize your event pages, and engage your
        audience - all in one place.
      </Text>
      <Box textAlign={'center'} marginTop={8}>
        <Link to="/signup">
          <Button>
            <SiNotion /> Sync With Notion
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
