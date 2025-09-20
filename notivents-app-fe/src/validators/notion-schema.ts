import { z } from 'zod/v4'

export const urlSchema = z.url()

export const emojiSchema = z.emoji()
