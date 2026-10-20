# Harness adoption and recovery

The reviewed public release is [Mirket 1.0.11](https://github.com/codemirket/harness/releases/tag/mirket-v1.0.11),
published 2026-10-20 at 07:01:43 UTC. `.mirket/release.json` is the single
machine-readable pin for public platform binaries, compiled source and catalog.
The asset digests were checked against the public release API and
[release manifest](https://github.com/codemirket/harness/releases/download/mirket-v1.0.11/mirket-release.json).
These establish artifact integrity against that publisher, not an independent signature.

## Setup and upgrades

Download the target-specific published CLI and verify its SHA-256 against the
pin before execution. On a new machine:

```sh
mirket setup --target all --yes
mirket project list --json
mirket project init --project "$PWD" --target all
mirket project plan --project "$PWD"
mirket project sync --project "$PWD" --prune
mirket project doctor --project "$PWD"
pnpm agents:check
```

Use existing registration when present. If an original directory was renamed,
inspect `mirket project relocate --help` and validate its identity; do not replace
registration with a copied checkout to hide relocation errors.

For an upgrade, inspect `mirket info --json`, `mirket update --check --json`, the
latest stable public release by publication date, and release notes. Pin reviewed
asset digests and fingerprints together. Run `mirket update --json` only when
installed content needs updating, then plan/sync/doctor. Do not manually overwrite
managed skills or rebuild an unreviewed substitute. Preserve edited managed files
and resolve their conflict before synchronization.

`pnpm agents:check` rejects wrong platform/binary/source/catalog identities and
runs real missing/tampered-skill probes in disposable directories for both hosts.
It does not modify the registered project to run those probes.

## Activation and package verification

Inside **each** actual Codex or Claude client, call Mirket `runtime_status`.
Compare `process.version`, `process.target`, `process.executable_sha256`,
`process.source_sha256`, `catalog.sha256` and `installed_binary.sha256` with the
pin; require `installed_binary.matches_process: true`. If stale, reconnect that
client's MCP connection and repeat. Terminal `mirket info` and a newly spawned
SDK session cannot attest an existing desktop session.

Run `mirket doctor --json` and `mirket catalog check`. Inspect the exact executable
paths configured in each client separately from the terminal's resolved path.
For selected packages use `mirket package status --json`, then
`mirket package probe design --schemas --json`, then an actual required operation.
A probe only establishes startup/discovery. Inspect operation output and its
runtime fingerprint as well as the saved artifact.

The current design workflow uses Style Dictionary through `pnpm design:tokens`.
Its script discovers the installed workspace, stages this project's canonical
palette and copies the compiled CSS into the app. `pnpm design:tokens --check`
verifies that committed output still matches. Local app development and CI use
committed CSS and do not need Podman or the optional design package.
No editable canvas, diagram, video, paged document or new vector artwork is part
of this app migration, so Penpot, Kroki, HyperFrames, Typst and vector production
are not required acceptance boundaries. Existing assets remain in place.

## Recovery and ownership

Product code and managed skill copies are versioned. Inspect diffs before restoring
files; do not discard unrelated edits. Regenerate the static output from the
chosen source and frozen lockfile. Validate a disposable container before replacing
a production service; production deployment requires separate authority.

Audio session state is intentionally ephemeral. Reload clears it; source files
remain on the user's device. No database, persistent memory or application data
migration is introduced. Cancelling processing suppresses late results and keeps
new processing disabled until native work settles and cleanup completes. Metadata reading itself is cancellable
and has a 15-second timeout before full decoding begins.

Mirket task state stays in Mirket's established local store. A binary rollback
alone cannot downgrade schema-4 state. If a future update changes durable state,
use the installed archive/restore help and release-specific procedure, then test
restoration in an isolated supported destination before upgrading. This adoption
started with 1.0.11 already installed and did not migrate or restore that state.

## Outstanding verification limits

The Codex connection was observed at 1.0.11 with matching public executable,
source and catalog fingerprints. Claude's configured executable was verified,
but its live connection must be checked from Claude itself. No remote CI run or
Windows execution is implied by local checks.

The dependency audit currently reports two high advisories in development tooling:
[`node-forge@1.4.0`](https://github.com/advisories/GHSA-86w9-cpqp-85rv) via
`listhen` and [`braces@3.0.3`](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
via `micromatch`/`globby`.
At adoption time these were the latest published npm versions; the audit supplied
no patched version. They are not copied into the Nginx static runtime, but their
build/development exposure remains. `pnpm audit` and the CI audit gate remain
unchanged and failing until upstream remediation is available. Reproduce with
`pnpm audit` and trace ownership with `pnpm why node-forge braces`.
