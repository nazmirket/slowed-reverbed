# Slowed & Reverbed Maker

[<img src="public/favicon.png" alt="Slowed & Reverbed Song Generator" width="72">](https://sr.mirket.dev/)

This Nuxt application creates slowed and reverbed WAV files with Tone.js. Audio
selection, preview, processing, and export all happen locally in the browser. Files
are never uploaded.

## Development

Use an LTS Node.js version from the range in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Before shipping a change:

```sh
pnpm check
pnpm audit
pnpm generate
```

## Podman deployment

The production image is a multi-stage build. Node.js is used only to test and generate
the static Nuxt output; an unprivileged Nginx process serves the final files.

```sh
podman compose up --build -d
podman compose ps
curl --fail http://127.0.0.1:9333/healthz
```

The Compose service binds to `127.0.0.1:9333` by default for a host-level reverse
proxy. Set `APP_PORT` when a different loopback port is needed:

```sh
APP_PORT=9334 podman compose up --build -d
```

To deploy an update on a single server, synchronize a clean source copy, run
`podman compose build`, then recreate only this service with
`podman compose up --no-deps -d app`. Verify `/healthz` before and after switching
the reverse-proxy upstream.

## Live site

[https://sr.mirket.dev/](https://sr.mirket.dev/)

## Author

- Instagram [@codemirket](https://instagram.com/codemirket)
