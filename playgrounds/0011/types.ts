import { z } from "zod"

// `data` property of K8s Secret.
export const secretDataSchema = z.object({
  key: z.string(),
  value: z.string()
})
export type SecretData = z.infer<typeof secretDataSchema>

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

/**
 * Expects the following format:
 * 
 * vaultName: keyVaultName
 * secretName: yourK8sSecretName
 * mapping:
 * - secretName: keyVaultSecret1
 *   secretKey: K8sSecretKey1
 * - secretName: keyVaultSecret2
 *   secretKey: K8sSecretKey2
 */
export const configSchema = z.object({
  vaultName: z.string(),
  secretName: z.string(),
  mapping: z.array(mappingSchema).nonempty()
})
export type Config = z.infer<typeof configSchema>

export const namespaceSchema = z.string({ message: 'Target namespace is required.' })
export type Namespace = z.infer<typeof namespaceSchema>
