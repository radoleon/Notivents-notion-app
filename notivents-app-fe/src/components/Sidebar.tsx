import {
  DASHBOARD_ROUTES_LIST,
  NAVBAR_HEIGHT_PX,
  SIDEBAR_EXPANDED_PX,
  SIDEBAR_PADDING_PX,
  SIDEBAR_PX
} from '@/constants/constants'
import { Box, Button, Flex, Skeleton, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import SidebarLink from './SidebarLink'

export interface SidebarProps {
  isSkeleton?: boolean
}

export default function Sidebar({ isSkeleton = false }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const toggleIsExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  return (
    <Box
      width={isExpanded ? SIDEBAR_EXPANDED_PX : SIDEBAR_PX}
      height={`calc(100vh - ${NAVBAR_HEIGHT_PX}px - ${SIDEBAR_PADDING_PX}px)`}
      position={'sticky'}
      top={NAVBAR_HEIGHT_PX}
      left={0}
      minWidth={isExpanded ? SIDEBAR_EXPANDED_PX : 0}
      transition="all 200ms ease"
      padding={4}
      rounded={'md'}
      bg={'bg.subtle'}
      bgImage={`url('/bg_texture.svg')`}
      bgSize={'cover'}
    >
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        paddingBottom={4}
        marginBottom={4}
        borderBottomWidth={'1px'}
      >
        {isExpanded && <Text fontWeight="bold">Dashboard</Text>}
        <Button onClick={toggleIsExpanded} size="xs" variant="subtle" padding={2}>
          {isExpanded ? <MdKeyboardDoubleArrowLeft /> : <MdKeyboardDoubleArrowRight />}
        </Button>
      </Flex>
      {!isSkeleton ? (
        <VStack align={'stretch'} gap={2}>
          {DASHBOARD_ROUTES_LIST.map((item, index) => (
            <SidebarLink key={index} {...item} isExpanded={isExpanded} />
          ))}
        </VStack>
      ) : (
        <VStack align={'stretch'} gap={2}>
          <SidebarLink {...DASHBOARD_ROUTES_LIST[0]} route="/dashboard" isExpanded={isExpanded} />
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} height={8}></Skeleton>
          ))}
        </VStack>
      )}
    </Box>
  )
}
