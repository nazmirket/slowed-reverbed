# Slowed & Reverbed — Mirket project guidance

Use the installed, verified absolute `bin/mirket` launcher and its Pi Durable host as the sole agent host and effect authority. Select this repository as the project; do not treat a launcher bound to another project as activation here. The host's selected skills and tools supply general methods. Do not install another agent, call an ambient agent executable, copy host configuration into this repository or edit account-wide settings to repair a project binding. Use only explicitly selected MCP tools and verified local executables; check actual capabilities before depending on them.

## Product and source owners

This Nuxt app generates a static site and processes audio entirely in the browser. Audio files must never leave the browser. `pages/index.vue` owns file selection, session state, preview, rendering and cancellation; `utils/audio.ts` owns pure validation and calculations; `utils/audio-metadata.ts` owns cancellable metadata checks. Nginx serves `.output/public` via `docker/nginx.conf`. Preserve the documented size/duration limits, preview/export parity, stereo channels, error recovery and resource cleanup. Cancellation discards late results; native decoding or rendering can finish before resources are released, so do not promise immediate interruption.

Inspect Git status and the affected implementation and consumers before editing. Preserve unrelated work, local user data, credentials, conversations, grants and recovery evidence. For a bug, reproduce a discriminating failure where practical, fix its owner and rerun the affected check. Update the owning documentation when behavior changes. Use Mirket's selected skills only where relevant; do not duplicate general skill instructions in this repository.

## Design and verification

`design/tokens.json` owns the palette and `assets/css/tokens.css` is its committed compiled output. When tokens change, invoke the selected Mirket `design_tokens` operation on the exact saved source revision with `format: "css"`, compare its output with the CSS consumer, and commit both. The build consumes the committed CSS; it does not require a design tool at install time. Inspect actual rendered pixels and behavior for visual changes. Use the selected project browser route for live UI tests, including representative widths and reduced motion when relevant; report missing coverage rather than substituting an ambient browser. Other Mirket design/video/MCP operations are available only when explicitly selected and verified for the task.

Use Node.js 22–24 and pnpm 10.33.0 for these application gates when their verified executables and dependencies are available:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm audit
pnpm generate
pnpm test:browser
```

Do not install a browser solely to satisfy an agent-run check; report an absent
selected browser/runtime instead. Browser tests exercise decoding, preview, stereo WAV export, corrupt input, cancellation and object-URL cleanup. Do not weaken tests or gates to mask an environment failure. For container changes, use an unused loopback port, isolated Compose project and unique image tag; a project name alone does not isolate the image tag. For example, with an authorized Podman/Compose installation: `podman compose config --quiet`, then `APP_PORT=9336 IMAGE_TAG=migration-validation podman compose -p slowed-reverbed-validation up --build -d`, check `http://127.0.0.1:9336/healthz`, and bring down only that disposable project. Container validation is separate from production deployment.

Audio session state is ephemeral; reload clears it, and the original file stays on the user's device. Metadata reading has a 15-second timeout before full decoding. Rebuild static output from source and the frozen lockfile. Report unavailable checks and untested platforms. A receipt, hash, screenshot or agent verdict alone does not prove correctness. External effects and commits/pushes need the user's authority; this migration request explicitly authorizes its commit and push, not deployment or account-wide changes.
