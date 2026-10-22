# Mirket 0.0.2 setup and recovery

This project pins the [official Mirket 0.0.2 release](https://github.com/codemirket/harness/releases/tag/mirket-v0.0.2),
published 2026-10-22T09:36:12Z. `.mirket/release.json` records the three
public binary URLs and SHA-256 digests from the release's
[manifest](https://github.com/codemirket/harness/releases/download/mirket-v0.0.2/mirket-release.json),
plus the published compiled-source fingerprint and the verified embedded-catalog
fingerprint. These establish integrity against the publisher, not an independent
signature or application correctness. CI and `pnpm agents:check` consume this pin.

## Ownership map

| Item                                              | Owner and status                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------------------- |
| `AGENTS.md`                                       | Project-specific source and verification rules for both hosts                    |
| `CLAUDE.md`                                       | Single import of `AGENTS.md`; no duplicate Claude playbook                       |
| `.mirket/project.json`                            | Mirket selection for Codex and Claude                                            |
| `.agents/skills/`, `.claude/skills/`              | Mirket-managed, versioned copies; change through `mirket project`                |
| `.mirket/release.json`, `scripts/harness*.mjs`    | Public release pin and executable, source, catalog and managed-copy checks       |
| `.github/workflows/harness.yml`                   | Linux harness gate; `.github/workflows/application.yml` owns application gates   |
| `scripts/design-tokens.mjs`, `design/tokens.json` | Project palette and Style Dictionary compilation through selected design package |
| `README.MD`, application source and tests         | Current product behavior and user journeys                                       |

There are no separate repository role catalogs, prompts, agent setup scripts or
nested instruction files. Local locks, runtime caches, host MCP configuration
and private task history stay outside source. Do not create a competing agent
framework or edit Mirket receipts to silence drift.

## Install and register

Follow the official [agent installation guide](https://github.com/codemirket/harness/blob/mirket-v0.0.2/docs/agent-installation.md).
Verify the 0.0.2 asset for the host OS and architecture against its release
manifest before execution. Keep the managed executable and Mirket application
data under `~/.mirket`; preserve unrelated host settings. The 0.0.1 registry is a
fresh baseline and does not import pre-0.0.1 project identities or durable state.
The 0.0.2 upgrade preserves existing 0.0.1 registrations and data. An installation
matching the reviewed 0.0.2 pin needs no replacement.

All registered projects share the per-user installed executable. Compare its
source identity before any repair; coordinate release pins rather than restoring
an older project pin over a newer global installation. Use `mirket update --plan`
to inspect a verified candidate and `mirket update --activate` for an authorized
upgrade that preserves saved selections and restores previously running groups.
Then verify `runtime_status` through each actual client connection.

Check all pages of `mirket project list --json --offset N --limit 10` before
registering a root. For a new checkout without `.mirket/project.json`, select the
actual hosts and expertise through supported commands:

```sh
mirket setup --dry-run --target all
mirket setup --target all --yes
mirket project init --project "$PWD" --target all
mirket project add --project "$PWD" --profile project-foundation
mirket project add --project "$PWD" --skill frontend-engineering
mirket project add --project "$PWD" --skill infrastructure-engineering
mirket project add --project "$PWD" --skill search-visibility
mirket project plan --project "$PWD"
mirket project sync --project "$PWD"
mirket project doctor --project "$PWD"
```

The `project-foundation` profile supplies architecture review, debugging, test
design and release operations; the three specialist skills match the Nuxt UI,
static hosting and public search surface. Do not add `portable-foundation` when
shared host guidance is installed. If a checkout already has
`.mirket/project.json` but the fresh registry has no entry for its root, use
`mirket project register --project "$PWD"` to register the current checkout, then
plan, sync and doctor. `project init` rejects an existing config. Inspect any
managed-copy conflict and preserve unique project rules before resolving it.
Do not use pruning or delete a receipt as a reset.

## Verify activation and use

Run `mirket doctor --json`, `mirket catalog check --json` and `pnpm agents:check`.
Call Mirket `runtime_status` inside each actual desktop client and compare its
version, executable, source and catalog fingerprints with `mirket info --json`
and the release pin. Require `installed_binary.matches_process: true`. A CLI
process or new test session does not prove an existing desktop MCP connection
reloaded. If stale, reconnect that client and repeat. Inspect configured
executable paths without copying private configuration into source.

When optional `design` or `agent-runtime` packages are selected, selection is
not readiness or proof of useful output. Check `mirket package status --json`
and probe a needed package before an actual operation. The
project's concrete design operation is `pnpm design:tokens`: it stages
`design/tokens.json` in the selected design workspace, invokes Style Dictionary,
and saves `assets/css/tokens.css`. `pnpm design:tokens --check` compares the saved
CSS with the source. Ordinary builds use committed CSS and need no design
service. For UI changes, inspect the live browser journey and screenshots at
representative widths and reduced motion. For other visual deliverables, use
OpenPencil for editable design, Kroki for diagrams (Excalidraw explicitly when
needed), Typst for paged work, SVG/resvg for vectors, Sharp for raster preparation
and Odiff for comparable pixels. Inspect each saved result. Encoded video is not
bundled.

Compile tokens for dependent production and reference their outputs in authored
source. Observational captures and saved-file exports preserve existing sources
without injecting or requiring tokens. Odiff reports completed comparisons and
whether pixels match separately; request `expect_match: true` when equality is
an acceptance requirement. Inspect applicable design axes and record why any
axis is irrelevant; keep all affected application gates.

With selected `agent-runtime`, make focused Mem0 reads for recurring decisions;
store only verified reusable facts with provenance and supersession. Project
source remains the owner of product facts. Mirket task records track coordination;
LangGraph checkpoints belong to Mirket-owned workers. After interruption,
inspect `workflow_status` and resume the original eligible run without resetting
budgets or replaying uncertain effects. Native host sessions use their own
recovery. This browser-only app needs neither package in its application runtime.

## Project checks

Use Node.js 22–24 and pnpm 10.33.0. Run the project gates without lowering their
thresholds:

```sh
pnpm install --frozen-lockfile
pnpm agents:check
pnpm check
pnpm audit
pnpm generate
pnpm exec playwright install chromium
pnpm test:browser
```

`pnpm agents:check` runs project doctor, entry-point and selection checks, real
missing and tampered managed-file probes for both hosts, and release identity
checks. It does not prove desktop activation or audio correctness. Browser tests
cover decoding, preview, stereo WAV export, corrupt input, cancellation and
object-URL cleanup. For bugs, keep a discriminating failure probe and rerun
relevant gates. For docs, verify changed links and executable examples. The
shared loop is observe, compare, diagnose, repair and recheck the actual result.

### Container validation

For container changes, use an unused loopback port, isolated Compose name and
unique image tag. A project name alone does not isolate the image tag:

```sh
podman compose config --quiet
APP_PORT=9336 IMAGE_TAG=migration-validation podman compose -p slowed-reverbed-validation up --build -d
curl --fail http://127.0.0.1:9336/healthz
podman compose -p slowed-reverbed-validation down
```

This validates a disposable container, not a production deployment.

## Recovery and known limits

Audio session state is ephemeral. Reload clears it; source files remain on the
user's device. Cancellation suppresses late results and waits for native work to
settle before cleanup. Metadata reading has a 15-second timeout before full
decoding. Regenerate static output from source and the frozen lockfile.

If registration reports a changed project identity, stop dependent durable
operations. Inspect the canonical path and original directory identity; do not
edit SQLite or bind a replacement checkout to an old namespace. Use supported
`mirket project relocate` only for a verified rename of the original directory
and only after checking its preconditions. Continue independent source work when
safe. Keep private task state and credentials out of the repository.

Historical evidence: the [1.0.11 Linux harness workflow](https://github.com/nazmirket/slowed-reverbed/actions/runs/39393197910)
and [initial application workflow](https://github.com/nazmirket/slowed-reverbed/actions/runs/39393064705)
were prior adoption checks. They do not establish current-release activation. The earlier
audit reported high advisories in development tooling (`node-forge` and
`braces`); run the current `pnpm audit` to establish current status. Claude live
activation, Windows and non-Chromium browser execution require their own checks.
