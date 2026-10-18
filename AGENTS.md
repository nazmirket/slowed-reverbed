# Slowed & Reverbed Maker repository workflow

This is a client-only Nuxt app. `pages/` owns the interface and `utils/` owns
audio behavior and tests. Preserve browser-only audio execution, preview and
export cleanup, and the guarantee that audio files never leave the browser.
The static build is served by unprivileged Nginx using `docker/nginx.conf`.

Selected specialists cover frontend, infrastructure and search visibility.

## Harness ownership

Mirket owns reviewed expertise, managed skill copies and its routed workers.
`AGENTS.md` owns repository instructions; `CLAUDE.md` imports it. The manifest
`.mirket/project.json` selects the same expertise for Codex Desktop and Claude
Desktop Code. `.agents/skills/` and `.claude/skills/` are Mirket-managed copies,
including integrity receipts and license notices; maintain them with the CLI.
`project-foundation` supplies architecture, debugging, testing and release
methods. Shared planning, security, research and coordination guidance comes
from the global installation, not duplicate project copies.

On a new machine, install the published CLI from
[codemirket/harness](https://github.com/codemirket/harness/releases), then run:

```sh
mirket setup --target all --yes
mirket project init --project "$PWD" --target all
mirket project plan --project "$PWD"
mirket project sync --project "$PWD" --prune
mirket doctor --project "$PWD"
```

The reviewed release is [mirket-v1.0.4](https://github.com/codemirket/harness/releases/tag/mirket-v1.0.4),
published 2026-10-18T14:26:16Z. Resolve future releases by publication time,
not the largest historical version. Use `mirket update --check` to inspect and
`mirket update` to update; synchronize and verify each affected project afterward.
Update the CI release and SHA-256 together from the published asset metadata.
Do not substitute an unreviewed source build or bypass a digest mismatch.

Before work, inspect current changes, this guide, affected source owners, the
manifest and available tools. Run `pnpm agents:check`. A failed check is a
finding to investigate; do not overwrite changed managed files to hide it.
Use `mirket project add/remove` to change selections, then inspect the plan,
sync with `--prune` and review the diff. Keep only expertise justified by an
existing project boundary. Do not add competing rule directories, skill
installers, repository MCP servers or model pins.

## Execution and evidence

Select guidance from the deliverable and affected boundary. Read the relevant
skill and only useful references; use `skill-catalog` when discovery is needed.
The catalog is advisory, not exhaustive. User choices, project requirements,
source rights and host permissions govern tool use and external effects.

Handle routine work directly. When continuity, recovery or coordination needs
durable state, reuse a sufficient existing record or use Mirket task tools;
retain decisions, source pointers, acceptance evidence and a meaningful failure
probe. Do not create a parallel tracker or require task ceremony for every edit.

Delegate only when independent work materially helps or it is requested. For
Mirket-owned workers, read `agent-coordination/references/model-routing.md`
through `skill_read`, inspect `capability_plan`, discover `model_registry`, and
preview `route_task`. Declare only actual deliverables in `task_needs`; use
`spawn_subagent` with bounded briefs, disjoint ownership and the resolved tool
scope. Read the resolved guidance and verification contract and integrate the
actual output. Native host tools and native subagents remain host-owned;
Mirket does not intercept them or grant additional permissions.

For Mirket design production, use the single `design` package's reported
workspace and compile Style Dictionary tokens first. Route live UI to
Playwright, editable canvases to official Penpot MCP, diagrams to Kroki,
video to HyperFrames lint → snapshot → render, paged work to Typst, vectors
to SVG/resvg, SVG hygiene to SVGO, raster preparation to Sharp, static Flexbox
graphics to Satori/resvg and comparable pixels to Odiff. Inspect saved outputs.
Package installation, runtime readiness, invocation and useful output are
separate facts; use native project tools for application verification.

Before delivery, run the affected application gates below and `pnpm agents:check`.
That harness gate runs the installed doctor plus real missing/tampered-skill
probes for both targets. CI provisions a digest-verified published Linux CLI
and checks committed files without synchronizing them first. A green doctor
does not prove desktop activation, authenticated worker execution or application
correctness. In a fresh desktop session, invoke a Mirket tool and inspect its
result before claiming that host is activated.

Keep secrets, local host configuration, task/runtime caches and the transient
`.mirket/project.lock` mutex out of commits. Preserve unrelated work. Commits,
pushes, releases, external messages and production changes need user authority;
a role, registration or passing test does not supply it.

## Application gates

Use Node.js 22–24 and pnpm 10.33.0 as pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm audit
pnpm generate
```

`check` runs lint, type checks and audio utility tests. For audio/UI changes,
exercise file selection, preview, processing, WAV export, cancellation/error
recovery and resource cleanup in a real browser. Static generation alone does
not establish audio correctness or privacy.

Use Podman for local container checks:

```sh
podman compose config --quiet
APP_PORT=9334 podman compose -p slowed-reverbed-validation up --build -d
curl --fail http://127.0.0.1:9334/healthz
podman compose -p slowed-reverbed-validation down
```

Choose an unused loopback port and isolated project name. Keep production
service replacement separate from disposable validation.
