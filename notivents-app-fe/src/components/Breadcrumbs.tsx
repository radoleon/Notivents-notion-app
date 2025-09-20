import { Breadcrumb } from '@chakra-ui/react'

export default function Breadcrumbs() {
  return (
    <Breadcrumb.Root size={'sm'} marginBottom={8}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link outline="none" href="#">
            Dashboard
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink outline="none">Workspaces</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
