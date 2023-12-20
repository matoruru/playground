import { sleepSync } from "bun"

export const sleep = (ms: number) => {
  console.log(`Wait for ${ms} milliseconds to be ready...`)
  sleepSync(ms)
  console.log("Ready!")
}