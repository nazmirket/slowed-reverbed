# Slowed & Reverbed Maker

This repository uses Mirket as its only agent workflow. The project manifest is
`.mirket/project.json`; synchronized skill copies live under `.agents/skills` for
Codex and `.claude/skills` for Claude Desktop Code. Treat those files as managed
artifacts and update them through Mirket.

## Mirket workflow

Run harness operations with the installed `mirket` executable:

```sh
mirket doctor
mirket project sync --project "$PWD"
mirket project doctor --project "$PWD"
```

For substantive work, start a task with the relevant capability (the project uses
`Frontend Engineer` for Nuxt behavior), read the task-bound skill, and record the
acceptance evidence and failure probe in the task. Use the repository's own
toolchain for application checks; Mirket does not replace `pnpm`, Nuxt, or Podman.

## Application workflow

Use Node.js 22–24 and pnpm 10.33.0:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm audit
pnpm generate
```

The app is a client-only Nuxt build. Keep browser-only audio APIs in client
execution and preserve the privacy guarantee that files stay in the browser.

## Containers

Podman is the supported local container runtime. Compose files remain in the
standard Compose format, so use Podman's Compose frontend:

```sh
podman compose up --build -d
podman compose ps
curl --fail http://127.0.0.1:9333/healthz
podman compose down
```

Set `APP_PORT` when another loopback port is needed. Keep generated output,
credentials, and local runtime state out of commits.
