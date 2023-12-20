FROM oven/bun:1 as install
WORKDIR /temp/build
COPY package.json bun.lockb /temp/build/
RUN bun install --frozen-lockfile

FROM install as build
COPY . .
RUN bun run compile

FROM gcr.io/distroless/base-debian12:debug
COPY --from=build /temp/build/app /
ENTRYPOINT [ "/app" ]