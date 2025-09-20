import { Box, Button, Heading, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink, useSearchParams } from 'react-router'

export default function ConfirmPage() {
  const [searchParams] = useSearchParams()

  const type = searchParams.get('type')
  const confirmationLink = searchParams.get('confirmation_link')

  const isAfterRedirect = type && confirmationLink

  return (
    <Box
      bgImage={`url('/bg_texture.svg')`}
      bgSize={'cover'}
      paddingBlock={8}
      marginBlock={16}
      textAlign={'center'}
    >
      <Heading as="h2" size={'2xl'} maxWidth={'30ch'} marginInline={'auto'}>
        {isAfterRedirect ? 'One last step' : 'Check your inbox'}
      </Heading>
      <Text fontSize={'md'} maxWidth={'60ch'} marginInline={'auto'} marginTop={8}>
        {isAfterRedirect
          ? 'To complete your signup, please click the button below. This helps us make sure you actually clicked the email yourself.'
          : 'We’ve sent you a confirmation email. Open it and click the link to finish setting up your account.'}
      </Text>
      {isAfterRedirect ? (
        <RouterLink to={confirmationLink!}>
          <Button mt={8}>Continue</Button>
        </RouterLink>
      ) : (
        <Text mt={8} fontSize={'sm'} color={'fg.muted'}>
          Didn’t receive confirmation email?{' '}
          <Link as="span" variant="underline">
            Resend
          </Link>
        </Text>
      )}
    </Box>
  )
}
