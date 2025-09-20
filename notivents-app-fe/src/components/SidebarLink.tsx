import { Button } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import { NavLink } from 'react-router'

export interface SidebarLinkProps {
  route: string
  title: string
  icon: IconType
  isExpanded: boolean
}

export default function SidebarLink({ route, title, icon, isExpanded }: SidebarLinkProps) {
  return (
    <NavLink to={route}>
      {({ isActive }) => (
        <Button
          width={'full'}
          justifyContent={'start'}
          gap={3}
          padding={2}
          size={'xs'}
          variant={isActive ? 'surface' : 'subtle'}
        >
          {icon({})} {isExpanded && title}
        </Button>
      )}
    </NavLink>
  )
}
