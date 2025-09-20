import { useColorModeValue } from '@/generated/color-mode'
import { Box, Center, Image } from '@chakra-ui/react'
import loader_dark from '.././assets/loader_dark.gif'
import loader_light from '.././assets/loader_light.gif'

export default function LoaderOverlay() {
  const loader = useColorModeValue(loader_light, loader_dark)

  return (
    <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={9999}>
      <Center h="100%" background={'bg'}>
        <Image src={loader} width={'4rem'} alt="Loading..." />
      </Center>
    </Box>
  )
}
