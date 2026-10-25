import { z } from 'zod'

export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  audience: z.enum(['ALL', 'STUDENT', 'FACULTY']),
  expiresAt: z.string().optional(),
})
