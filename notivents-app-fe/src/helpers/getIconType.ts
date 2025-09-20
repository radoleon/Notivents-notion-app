import { emojiSchema, urlSchema } from '@/validators/notion-schema'

export function getIconType(icon: string | null): string | null {
  if (!icon) return null

  let result = urlSchema.safeParse(icon)

  if (result.success) {
    return 'url'
  }

  result = emojiSchema.safeParse(icon)

  if (result.success) {
    return 'emoji'
  }

  return null
}
