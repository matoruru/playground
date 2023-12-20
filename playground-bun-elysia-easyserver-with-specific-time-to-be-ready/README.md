# playground-bun-elysia-easyserver-with-specific-time-to-be-ready

## Development
To start the development server run:

```bash
PORT=8000 TIME_TO_BE_READY=1000 bun run dev
```

- `PORT` is the port number.
- `TIME_TO_BE_READY` is the time until the server instance gets ready.

Open http://localhost:3000/ with your browser to see the result.

## How to build multi-platform image

```
docker buildx build --platform linux/amd64,linux/arm64,linux/x86_64 --no-cache -t matoruru/dummyserver:1.0.0 --push .
```

If you see this error

```
ERROR: multiple platforms feature is currently not supported for docker driver. Please switch to a different driver (eg. "docker buildx create --use")
```

Try this before executting `docker buildx build --platform ...`:

```
docker buildx create --use
```
