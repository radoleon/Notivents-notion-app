import { toaster } from '@/generated/toaster'

export function createToaster(type: 'success' | 'error' | 'info' | 'warning', message: string) {
  toaster.create({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: message,
    type,
    duration: 2000
  })
}
