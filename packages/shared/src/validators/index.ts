/**
 * FILE: packages/shared/src/validators/index.ts
 * PURPOSE: Zod validation schemas for Ninja Shop forms and API inputs
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 3.2)
 *
 * DEPENDENCIES:
 *   - zod: schema validation library
 *
 * RELATED FILES:
 *   - packages/shared/src/types/index.ts: TypeScript types derived from these schemas
 */

import { z } from 'zod'

export const accountFormSchema = z.object({
  account_number: z.string().min(1).max(50),
  account_name: z.string().max(100).optional(),
  status: z.enum(['available', 'rented']),
  rented_until: z.string().date().optional().nullable(),
  renter_contact: z.string().max(255).optional(),
  notes: z.string().optional(),
})

export const priceUpdateSchema = z.object({
  price: z.number().positive(),
  duration_days: z.number().int().positive(),
  description: z.string().optional(),
  is_active: z.boolean(),
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const lineUrlSchema = z.string().refine(
  (val) => val.startsWith('https://line.me/'),
  { message: 'LINE URL ต้องขึ้นต้นด้วย https://line.me/' }
)

export const facebookUrlSchema = z.string().refine(
  (val) =>
    val.startsWith('https://facebook.com/') ||
    val.startsWith('https://www.facebook.com/'),
  { message: 'Facebook URL ต้องขึ้นต้นด้วย https://facebook.com/ หรือ https://www.facebook.com/' }
)

// rentalStatusSchema: when status is 'rented', rented_until must be a future date;
// when 'available', rented_until must be null/undefined
export const rentalStatusSchema = z
  .object({
    status: z.enum(['available', 'rented']),
    rented_until: z.string().date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'rented') {
      if (!data.rented_until) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rented_until'],
          message: 'ต้องระบุวันที่คืนเมื่อสถานะเป็น rented',
        })
        return
      }
      const rentedUntil = new Date(data.rented_until)
      if (rentedUntil <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rented_until'],
          message: 'วันที่คืนต้องเป็นวันในอนาคต',
        })
      }
    } else if (data.status === 'available') {
      if (data.rented_until != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rented_until'],
          message: 'ต้องล้างวันที่คืนเมื่อสถานะเป็น available',
        })
      }
    }
  })
