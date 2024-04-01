import { z } from 'zod'

export type Env = z.infer<typeof EnvSchema>

export const EnvSchema = z.object({
  PORT: z.coerce.number(),
  TIME_TO_BE_READY: z.coerce.number(),
})