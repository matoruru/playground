import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"
import * as YAML from "yaml"
import { configSchema, type Data } from "./types"

const rawConfig = process.env.CONFIG
if (!rawConfig) throw new Error('CONFIG is not set.')
const config = configSchema.parse(YAML.parse(rawConfig))

const credential = new DefaultAzureCredential()

const url = `https://${config.vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

async function main() {
  const data: Data[] = []
  for (const { secretName, secretKey } of config.mapping) {
    const result = await client.getSecret(secretName)
  }
  // const result = await client.getSecret(secretName)
  // console.log("result: ", result)
}

main()
