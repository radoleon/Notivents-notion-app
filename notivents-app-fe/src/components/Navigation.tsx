import { NAVBAR_HEIGHT_PX } from '@/constants/constants'
import { ColorModeButton, useColorModeValue } from '@/generated/color-mode'
import { createToaster } from '@/helpers/createToaster'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/services/authenticationService'
import { Avatar, Button, Flex, HStack, Image, Skeleton, Stack, Text } from '@chakra-ui/react'
import { isAuthError } from '@supabase/supabase-js'
import { useState } from 'react'
import { Link } from 'react-router'
import logo_title_dark from '/logo_title_dark.svg'
import logo_title_light from '/logo_title_light.svg'

export default function Navigation() {
  const [isLocalLoading, setIsLocalLoading] = useState(false)

  const { profile } = useAuth()
  const logo = useColorModeValue(logo_title_light, logo_title_dark)

  const handleClick = async (): Promise<void> => {
    setIsLocalLoading(true)

    try {
      await logout()
    } catch (error) {
      if (isAuthError(error)) {
        createToaster('error', error.message)
      }
    } finally {
      setIsLocalLoading(false)
    }
  }

  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      bg={'bg'}
      paddingBlock={4}
      position={'sticky'}
      top={0}
      left={0}
      zIndex={100}
      maxHeight={NAVBAR_HEIGHT_PX}
    >
      <Link to="/">
        <Image src={logo} height={50} paddingBlock={2} alt="Logo" />
      </Link>
      <Flex alignItems={'center'}>
        {profile && (
          <>
            <HStack gap={3} marginRight={8}>
              <Avatar.Root>
                <Avatar.Fallback />
                {profile.avatar_url && <Avatar.Image src={profile.avatar_url} />}
              </Avatar.Root>
              <Stack gap={0}>
                {profile.username ? (
                  <Text textStyle={'sm'}>{profile.username}</Text>
                ) : (
                  <Skeleton height={'20px'} width={'150px'}></Skeleton>
                )}
                <Text color={'fg.muted'} textStyle={'xs'}>
                  {profile.email}
                </Text>
              </Stack>
            </HStack>
            <Button
              variant="outline"
              marginRight={4}
              loading={isLocalLoading}
              onClick={handleClick}
            >
              Log Out
            </Button>
          </>
        )}
        <ColorModeButton />
      </Flex>
    </Flex>
  )
}
