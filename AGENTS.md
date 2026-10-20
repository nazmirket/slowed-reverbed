# Slowed & Reverbed repository workflow

A statically generated Nuxt app with browser-only audio processing. Audio files
must never leave the browser. `pages/index.vue` owns session state, preview,
rendering and cancellation; `utils/audio.ts` owns pure validation and calculations.
Nginx serves `.output/public` using `docker/nginx.conf`. Preserve product limits,
preview/export parity, stereo channels and resource cleanup.

## Harness and responsibilities

The public release and platform digests are pinned in `.mirket/release.json`.
CI and `pnpm agents:check` consume that same pin. See
[the harness guide](docs/harness.md) for provenance, setup, activation and recovery.
`AGENTS.md` owns project requirements; `CLAUDE.md` imports it.
`.mirket/project.json` selects shared expertise for both hosts: project-foundation
plus frontend, infrastructure and search visibility. Mirket owns `.agents/skills/`
and `.claude/skills/`; change selections and managed copies through its CLI.
Global guidance owns planning, security, research and coordination methods.

Before work, inspect current changes, relevant source owners, the manifest and
available tools; run `pnpm agents:check`. Investigate failures rather than
silencing them. Read installed `skill-catalog` for substantive selection, then
only the lead and useful supporting guidance. Use current command help for
unfamiliar CLI options. Use `mirket setup`, `doctor` and `update` for harness
operations. Inspect project registration before initializing or relocating.

Work directly unless independent assignments materially help. Follow installed
routing contracts for Mirket workers; native tools retain host permissions.
Use one existing project/task record for substantial resumable work. Keep private
execution history, credentials, local client configuration and runtime caches out
of source. Authoritative product facts belong in their owning files. This stateless
app does not require Mem0 or LangGraph in its application runtime.

## Design and verification

Use the installed `interface-design/references/image-to-code.md` contract for
visual work, including its current medium-specific budgets. Existing inspected
screens may govern focused repairs. `design/tokens.json` owns the palette;
`pnpm design:tokens` compiles it through the installed Mirket design package.
Commit generated `assets/css/tokens.css`; ordinary builds need no design service.
Use Playwright for the live app and inspect captures, interactions and reduced
motion at representative widths. Select other production tools only for actual
artifact deliverables; do not add packages to satisfy a checklist.

Use Node.js 22–24 and pnpm 10.33.0. Required gates:

```sh
pnpm install --frozen-lockfile
pnpm agents:check
pnpm check
pnpm audit
pnpm generate
pnpm exec playwright install chromium
pnpm test:browser
```

Browser tests exercise real decoding, preview, stereo WAV export, corrupt input,
cancellation and object-URL cleanup. Additional changes require relevant failure
and recovery probes. Cancellation discards results; native decoding/rendering
may finish before resources can be released. Do not claim immediate interruption.

For container changes, use an unused loopback port, isolated Compose name and
unique image tag (a project name alone does not isolate the image tag):

```sh
podman compose config --quiet
APP_PORT=9336 IMAGE_TAG=migration-validation podman compose -p slowed-reverbed-validation up --build -d
curl --fail http://127.0.0.1:9336/healthz
podman compose -p slowed-reverbed-validation down
```

A CLI doctor, installation receipt, hash, worker verdict or render is not
application acceptance or desktop activation. Call `runtime_status` through each
actual client and inspect package invocation separately. Record untested platforms
and baseline failures. Do not lower gates to obtain a green result.

Preserve unrelated work. Commits, pushes, PRs, external messages, production
changes, destructive operations and new production dependencies need user
authority. Passing checks and registration do not grant that authority.
