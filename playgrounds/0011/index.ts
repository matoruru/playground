import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"
import * as YAML from "yaml"
import { configSchema, type Data } from "./types"

// Parse config as yaml.
const rawConfig = process.env.CONFIG
if (!rawConfig) throw new Error('CONFIG is not set.')
const config = configSchema.parse(YAML.parse(rawConfig))

// Setup a KeyVault client.
const credential = new DefaultAzureCredential()
const url = `https://${config.vaultName}.vault.azure.net`
const client = new SecretClient(url, credential)

// This function takes about 1 mins to finish somehow.
// It might look never-ending but try to just wait for this to complete.
const constructSecretData = async () => {
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
  const data: Data[] = results.reduce((acc: Data[], result) => {
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

const secretData = await constructSecretData()
