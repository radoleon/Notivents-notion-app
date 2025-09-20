import { getIconType } from '@/helpers/getIconType'
import { Box, Image, Text } from '@chakra-ui/react'

export interface DatabaseTitleProps {
  title: string | null
  icon: string | null
}

export default function DatabaseTitle({ title, icon }: DatabaseTitleProps) {
  return (
    <>
      {getIconType(icon) === 'url' && <Image src={icon!} boxSize={4} />}
      {getIconType(icon) === 'emoji' && <Text>{icon!}</Text>}
      {!icon && <Box boxSize={4}></Box>}
      {title ? title : <Text color={'fg.muted'}>(no title)</Text>}
    </>
  )
}
