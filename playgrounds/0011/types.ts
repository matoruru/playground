import { z } from "zod"

export const secretDataSchema = z.object({
  key: z.string(),
  value: z.string()
})
export type Data = z.infer<typeof secretDataSchema>

export const secretSchema = z.object({
  secretName: z.string(),
  Data: z.array(secretDataSchema)
})
export type Secret = z.infer<typeof secretSchema>

export const mappingSchema = z.object({
  secretName: z.string(),
  secretKey: z.string()
})
export type Mapping = z.infer<typeof mappingSchema>

export const configSchema = z.object({
  vaultName: z.string(),
  secretName: z.string(),
  mapping: z.array(mappingSchema).nonempty()
})
export type Config = z.infer<typeof configSchema>
