import Breadcrumbs from '@/components/Breadcrumbs'
import Sidebar from '@/components/Sidebar'
import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <Flex gap={8}>
      <Sidebar />
      <Box width={'full'}>
        <Breadcrumbs />
        <Outlet />
      </Box>
    </Flex>
  )
}
