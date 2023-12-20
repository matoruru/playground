import { Elysia } from "elysia"
import { logger } from '@bogeychan/elysia-logger'
import { EnvSchema } from "./env"
import { sleep } from "./util"

const env = EnvSchema.parse(process.env)

sleep(env.TIME_TO_BE_READY)

const app = new Elysia()
  .use(logger({
    level: 'info'
  }))
  .get("/healthz", () => "ok")
  .get("/kill", () => {
    console.log("This server is killed by someone.")
    app.stop()
  })
  .all("*", () => 'Try "GET /healthz" or "GET /kill"')
  .listen(env.PORT)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)