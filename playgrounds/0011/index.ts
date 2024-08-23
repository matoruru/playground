import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"
import * as YAML from "yaml"
import { configSchema, namespaceSchema, type SecretData } from "./types"
import * as k8s from '@kubernetes/client-node'

// Parse config as yaml.
const rawConfig = process.env.CONFIG
if (!rawConfig) throw new Error('CONFIG is not set.')
const config = configSchema.parse(YAML.parse(rawConfig))

// Get Namespace from environment variable.
const namespace = namespaceSchema.parse(process.env.TARGET_NAMESPACE)

// Setup a KeyVault client.
const credential = new DefaultAzureCredential()
const url = `https://${config.vaultName}.vault.azure.net`
const client = new SecretClient(url, credential)

// This function takes about 1 mins to finish somehow.
// It might look never-ending but try to just wait for this to complete.
const constructSecretData = async (): Promise<SecretData[]> => {
  const promises = config.mapping.map(async ({ secretName, secretKey }) => {
  try {
    const keyVaultSecret = await client.getSecret(secretName);
    keyVaultSecret.properties
    return { secretKey, keyVaultSecret };
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    return { secretKey, keyVaultSecret: { name: secretName, value: undefined } };
  }
  })
  const results = await Promise.all(promises)
  const data: SecretData[] = results.reduce((acc: SecretData[], result) => {
    const { secretKey, keyVaultSecret } = result
    const { name, value } = keyVaultSecret

    if (!value) {
      console.log(`The value of ${name} is undefined! Result details:`, keyVaultSecret)
    }
    return [ ...acc, { key: secretKey, value: `${value}` } ]
  }, [])

  console.log(data)
  
  return data
}

// Transform SecretData for a library type
const secretData: SecretData[] = await constructSecretData()
let v1SecretObj: k8s.V1Secret['data'] = {}
for (const kv of secretData) {
  v1SecretObj = { ...v1SecretObj, ...{ [`${kv.key}`]: kv.value } }
}

// Create K8s Secret here.
const kc = new k8s.KubeConfig()
kc.loadFromDefault()
const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

const createSecret = async () => {
  try {
    const secretRes = await k8sApi.createNamespacedSecret(namespace, { data: v1SecretObj, immutable: true })
    console.log('Created: ', secretRes)
  } catch (e) {
    console.error(e)
  }
}

await createSecret()
