# Slowed & Reverbed agent workflow

Mirket 0.0.2 supplies the shared method for Codex Desktop and Claude Desktop
Code. This file owns project-specific rules; `CLAUDE.md` imports it. The release
pin, setup and recovery procedure live in [docs/harness.md](docs/harness.md).

## Product boundaries

This is a statically generated Nuxt app with browser-only audio processing.
Audio files must never leave the browser. `pages/index.vue` owns session state,
preview, rendering and cancellation; `utils/audio.ts` owns pure validation and
calculations; `utils/audio-metadata.ts` owns cancellable metadata checks. Nginx
serves `.output/public` using `docker/nginx.conf`. Preserve product limits,
preview/export parity, stereo channels, error recovery and resource cleanup.
Cancellation discards late results; native decoding or rendering may finish
before resources can be released. Do not promise immediate interruption.

## Work in this repository

Inspect current changes, the affected source and consumers, `.mirket/project.json`
and available tools before editing. Run `pnpm agents:check` and diagnose failures.
Use installed Mirket guidance selectively for the affected boundary. Keep routine
work direct; use one durable task only when continuity, recovery or coordination
helps. For bugs, reproduce the symptom when practical, test a discriminating
cause, fix its owner, and rerun the probe and affected gates. For reviews, trace
changed behavior to consumers and report actionable source evidence. Update the
owning documentation when behavior or commands change.

`.mirket/project.json` selects `project-foundation`, frontend engineering,
infrastructure engineering and search visibility for both hosts. Mirket manages
`.agents/skills/` and `.claude/skills/`; change selections with `mirket project`
commands, inspect the plan, then sync and doctor. Do not hand-edit managed copies
or receipts. Global installed guidance owns general planning, security,
documentation, design, context and coordination methods. Mirket-owned workers,
when justified, use its routed spawner and LangGraph checkpoints. Native host
sessions keep their own lifecycle. Do not launch paid workers to demonstrate
adoption or change a chosen provider, model or budget.

For visual work, start from an inspected target and compare actual renders and
behavior. Compile `design/tokens.json` with `pnpm design:tokens` before dependent
rendering; commit `assets/css/tokens.css`. Use Playwright for the live interface,
including representative widths and reduced motion. Use the selected Mirket
`design` package for actual editable designs (OpenPencil), diagrams (Kroki;
select Excalidraw explicitly), paged work (Typst), vectors (SVG/resvg), raster
preparation (Sharp) or comparable pixels (Odiff). Inspect saved artifacts.
Observational captures and saved-file exports do not inject or require tokens.
Use `expect_match: true` for Odiff only when pixel equality is required; a completed
comparison can otherwise report differences.
Encoded video requires separately selected host tooling. With selected
`agent-runtime`, recall relevant prior decisions through focused Mem0 reads and
retain only verified stable facts with provenance and supersession.

## Verification and authority

Use Node.js 22–24 and pnpm 10.33.0. Keep these required gates and their coverage:

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
cancellation and object-URL cleanup. Add relevant failure and recovery probes for
changed behavior. Report advisory audit findings without weakening the gate. For
container changes, use an unused loopback port, isolated Compose name and unique
image tag; see [container validation](docs/harness.md#container-validation).
Report unavailable checks and untested platforms.

Preserve unrelated work, application data, credentials, private execution
history and host settings. Commits, pushes, PRs, external messages, production
changes, destructive operations and new production dependencies require user
authority. A receipt, hash, screenshot or worker verdict alone does not establish
application correctness or desktop activation.
