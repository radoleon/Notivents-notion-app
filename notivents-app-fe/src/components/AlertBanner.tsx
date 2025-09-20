import { Alert, Button, CloseButton } from '@chakra-ui/react'

export interface AlertBannerProps {
  status: 'error' | 'success' | 'info' | 'warning'
  message: string
  clearCallback?: () => void
  buttonCallback?: () => void
  buttonText?: string
}

export default function AlertBanner({
  status,
  message,
  clearCallback,
  buttonCallback,
  buttonText
}: AlertBannerProps) {
  const getColorPallete = (status: 'error' | 'success' | 'info' | 'warning'): string => {
    switch (status) {
      case 'error':
        return 'red'
      case 'success':
        return 'green'
      case 'info':
        return 'blue'
      case 'warning':
        return 'yellow'
    }
  }

  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Content alignItems={'start'}>
        <Alert.Title>{status.charAt(0).toUpperCase() + status.slice(1)}</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
        {buttonCallback && (
          <Button colorPalette={getColorPallete(status)} mt={2} size={'sm'}>
            {buttonText || 'Confirm'}
          </Button>
        )}
      </Alert.Content>
      {clearCallback && (
        <CloseButton onClick={clearCallback} pos={'relative'} top={-2} insetEnd={-2} />
      )}
    </Alert.Root>
  )
}
