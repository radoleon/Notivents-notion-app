import { z } from 'zod/v4'

export const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_.\- ]+$/, 'Username contains invalid characters')
  .min(4, 'Username must be at least 4 characters')
  .max(16, 'Username must be at most 16 characters')

export const emailSchema = z
  .email('Invalid email address format')
  .max(64, 'Email must be at most 64 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
