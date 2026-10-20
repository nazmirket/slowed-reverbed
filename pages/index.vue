<template>
	<main class="app-shell">
		<div class="app-orbit app-orbit--one" aria-hidden="true"></div>
		<div class="app-orbit app-orbit--two" aria-hidden="true"></div>

		<div class="app-frame">
			<header class="site-header">
				<a class="brand" href="/" aria-label="Slowed and Reverbed home">
					<span class="brand-mark" aria-hidden="true"
						><span></span><span></span><span></span><span></span
					></span>
					<span class="brand-copy"
						><strong>slowed<span>&amp;</span>reverbed</strong
						><small>private audio studio</small></span
					>
				</a>
				<p class="header-note"
					><span class="status-dot" aria-hidden="true"></span>Runs locally in your
					browser</p
				>
			</header>

			<div class="studio-layout">
				<section class="intro-panel" aria-labelledby="page-title">
					<p class="eyebrow">A softer kind of loud</p>
					<h1 id="page-title">Shape the<br /><em>atmosphere.</em></h1>
					<p class="intro-copy"
						>Slow the tempo, open the room, and make a version that feels like yours. Your
						audio never leaves this device.</p
					>
					<div class="signal-line" aria-hidden="true"
						><span></span><span></span><span></span><span></span><span></span><span></span
						><span></span><span></span><span></span><span></span><span></span><span></span
						><span></span><span></span><span></span><span></span
					></div>
					<div class="process-note"
						><span class="process-number">01</span
						><span
							>Choose a source, make it yours,<br />take the finished WAV with you.</span
						></div
					>
				</section>

				<section class="workbench" aria-labelledby="editor-title">
					<div class="workbench-topline">
						<div
							><p class="eyebrow eyebrow--dark">Your session</p
							><h2 id="editor-title">Audio workspace</h2></div
						>
						<span class="session-pill"
							><span class="status-dot status-dot--dark" aria-hidden="true"></span>Local
							only</span
						>
					</div>

					<input
						ref="fileInput"
						aria-label="Audio source file"
						class="visually-hidden"
						type="file"
						accept="audio/*,.aac,.flac,.m4a,.mp3,.mp4,.oga,.ogg,.opus,.wav,.wave,.webm"
						@change="handleFileChange"
					/>

					<div v-if="!file" class="empty-state">
						<div class="upload-visual" aria-hidden="true"
							><div class="upload-orb"><span></span></div
							><div class="upload-wave upload-wave--one"></div
							><div class="upload-wave upload-wave--two"></div
						></div>
						<h3>Start with a sound</h3>
						<p>MP3, WAV, M4A, FLAC, OGG, or WebM<br />up to 150 MB and 20 minutes</p>
						<button
							type="button"
							class="button button--primary button--wide"
							:disabled="isLoading"
							@click="fileInput?.click()"
							><span>Choose an audio file</span
							><span class="button-arrow" aria-hidden="true">↗</span></button
						>
						<p class="privacy-note"
							><span aria-hidden="true">✦</span> Nothing is uploaded. Processing happens
							on this device.</p
						>
					</div>

					<div v-else class="editor-state">
						<div class="source-card">
							<div class="source-icon" aria-hidden="true"
								><span></span><span></span><span></span><span></span
							></div>
							<div class="source-details"
								><span class="source-label">{{
									isConverted ? 'Finished version' : 'Source audio'
								}}</span
								><strong :title="file.name">{{ file.name }}</strong
								><span
									>{{ file.type || 'Audio file' }} <i aria-hidden="true">·</i> stays on
									this device</span
								></div
							>
							<button
								type="button"
								class="icon-button"
								aria-label="Choose a different audio file"
								:disabled="isLoading"
								@click="fileInput?.click()"
								>↗</button
							>
						</div>

						<div v-if="!isConverted" class="settings-panel">
							<div class="settings-heading"
								><div
									><span class="eyebrow eyebrow--dark">Make it yours</span
									><h3>Shape the sound</h3></div
								><span class="settings-hint">Adjust, then preview</span></div
							>
							<div class="slider-stack">
								<label class="slider-control"
									><span class="slider-meta"
										><span>Slowdown</span
										><strong>{{ slowdown }}<small>%</small></strong></span
									><span class="slider-caption"
										><span>Original</span><span>Dreamy</span></span
									><input
										v-model.number="slowdown"
										class="range-input"
										type="range"
										:style="{ '--range-fill': slowdownFill }"
										:min="MIN_SLOWDOWN_PERCENT"
										:max="MAX_SLOWDOWN_PERCENT"
										:aria-label="`Slowdown percentage: ${slowdown}`"
								/></label>
								<label class="slider-control"
									><span class="slider-meta"
										><span>Reverb</span
										><strong>{{ reverb }}<small>/10</small></strong></span
									><span class="slider-caption"
										><span>Close</span><span>Wide open</span></span
									><input
										v-model.number="reverb"
										class="range-input"
										type="range"
										:style="{ '--range-fill': reverbFill }"
										:min="MIN_REVERB_LEVEL"
										:max="MAX_REVERB_LEVEL"
										:aria-label="`Reverb level: ${reverb}`"
								/></label>
							</div>
							<button
								type="button"
								class="button button--primary button--wide"
								:disabled="isLoading"
								@click="convert"
								><span>{{
									isLoading ? 'Preparing your sound…' : 'Create my version'
								}}</span
								><span class="button-arrow" aria-hidden="true">→</span></button
							>
						</div>

						<div v-else class="result-panel">
							<div class="result-banner"
								><span class="result-check" aria-hidden="true">✓</span
								><span
									><strong>Your version is ready</strong
									><small>Listen back or save the WAV</small></span
								></div
							>
							<div class="result-wave" aria-hidden="true"
								><span
									v-for="bar in 32"
									:key="bar"
									:style="{ height: `${18 + ((bar * 17) % 52)}%` }"
								></span
							></div>
							<div class="result-actions"
								><button
									type="button"
									class="play-button"
									:disabled="isLoading"
									:aria-label="isPlaying ? 'Pause preview' : 'Play preview'"
									@click="togglePlayback"
									><img v-if="!isPlaying" src="/play.svg" alt="" /><img
										v-else
										src="/pause.svg"
										alt="" /></button
								><button
									type="button"
									class="button button--primary"
									:disabled="isLoading"
									@click="download"
									><span>{{ isLoading ? 'Rendering…' : 'Download WAV' }}</span
									><span class="button-arrow" aria-hidden="true">↓</span></button
								><button
									type="button"
									class="button button--quiet"
									:disabled="isLoading"
									@click="reset"
									>Start over</button
								></div
							>
						</div>
					</div>

					<button
						v-if="isLoading"
						type="button"
						class="button button--quiet"
						@click="cancelOperation"
						>Cancel processing</button
					>
					<p v-if="errorMessage" class="error-message" role="alert"
						><span aria-hidden="true">!</span>{{ errorMessage }}</p
					>
					<p class="status-message" aria-live="polite"
						><span class="status-bar" aria-hidden="true"></span>{{ statusMessage }}</p
					>
				</section>
			</div>

			<footer class="site-footer"
				><span>Made for late-night listening</span
				><a href="https://github.com/nazmirket"
					>@nazmirket <span aria-hidden="true">↗</span></a
				><span>Browser audio · no uploads</span></footer
			>
		</div>
	</main>
</template>

<script setup lang="ts">
import btow from 'audiobuffer-to-wav'
import { readAudioDuration } from '~/utils/audio-metadata'
import { computed, onBeforeUnmount, ref } from 'vue'
import {
	DEFAULT_REVERB_LEVEL,
	DEFAULT_SLOWDOWN_PERCENT,
	MAX_REVERB_LEVEL,
	MAX_SLOWDOWN_PERCENT,
	MIN_REVERB_LEVEL,
	MIN_SLOWDOWN_PERCENT,
	REVERB_DECAY_SECONDS,
	REVERB_PREDELAY_SECONDS,
	getDownloadFileName,
	getPlaybackRate,
	getRenderDuration,
	getWetMix,
	validateAudioDuration,
	validateAudioFile,
} from '~/utils/audio'

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const slowdown = ref(DEFAULT_SLOWDOWN_PERCENT)
const reverb = ref(DEFAULT_REVERB_LEVEL)
const isLoading = ref(false)
const isConverted = ref(false)
const isPlaying = ref(false)
const errorMessage = ref('')
const sourceUrl = ref('')

let player: import('tone').Player | null = null
let reverbEffect: import('tone').Reverb | null = null
let sourceObjectUrl = ''
let operation: AbortController | null = null
let disposed = false

const statusMessage = computed(() => {
	if (isLoading.value) return 'Processing locally in your browser…'
	if (isConverted.value)
		return 'Ready to preview or download. Your file stays on this device.'
	if (file.value) return 'Choose your settings, then create your version.'
	return 'Choose an audio file to begin. Files are processed locally in your browser.'
})

const slowdownFill = computed(
	() =>
		`${((slowdown.value - MIN_SLOWDOWN_PERCENT) / (MAX_SLOWDOWN_PERCENT - MIN_SLOWDOWN_PERCENT)) * 100}%`,
)
const reverbFill = computed(
	() =>
		`${((reverb.value - MIN_REVERB_LEVEL) / (MAX_REVERB_LEVEL - MIN_REVERB_LEVEL)) * 100}%`,
)

function releaseSourceUrl() {
	if (!sourceObjectUrl) return
	URL.revokeObjectURL(sourceObjectUrl)
	sourceObjectUrl = ''
}
function disposePlayer() {
	player?.stop()
	player?.dispose()
	reverbEffect?.dispose()
	player = null
	reverbEffect = null
	isPlaying.value = false
}

function handleFileChange(event: Event) {
	const input = event.target as HTMLInputElement
	const selectedFile = input.files?.[0] ?? null
	if (!selectedFile) return
	if (isLoading.value) {
		input.value = ''
		return
	}
	errorMessage.value = validateAudioFile(selectedFile) ?? ''
	disposePlayer()
	releaseSourceUrl()
	isConverted.value = false
	sourceUrl.value = ''
	file.value = errorMessage.value ? null : selectedFile
	if (file.value) {
		sourceObjectUrl = URL.createObjectURL(file.value)
		sourceUrl.value = sourceObjectUrl
	}
	input.value = ''
}

function cancelOperation() {
	operation?.abort()
}

async function convert() {
	if (isLoading.value || !file.value || !sourceUrl.value) return
	const controller = new AbortController()
	operation = controller
	isLoading.value = true
	errorMessage.value = ''
	isConverted.value = false
	disposePlayer()
	let nextPlayer: import('tone').Player | null = null
	let nextFilter: import('tone').Reverb | null = null
	try {
		const metadataDuration = await readAudioDuration(sourceUrl.value, controller.signal)
		const metadataError = validateAudioDuration(metadataDuration)
		if (metadataError) throw new Error(metadataError)
		const Tone = await import('tone')
		controller.signal.throwIfAborted()
		await Tone.start()
		controller.signal.throwIfAborted()
		nextPlayer = new Tone.Player()
		await nextPlayer.load(sourceUrl.value)
		controller.signal.throwIfAborted()
		const durationError = validateAudioDuration(nextPlayer.buffer.duration)
		if (durationError) throw new Error(durationError)
		nextPlayer.playbackRate = getPlaybackRate(slowdown.value)
		nextFilter = new Tone.Reverb({
			decay: REVERB_DECAY_SECONDS,
			preDelay: REVERB_PREDELAY_SECONDS,
			wet: getWetMix(reverb.value),
		}).toDestination()
		nextPlayer.connect(nextFilter)
		await nextFilter.ready
		controller.signal.throwIfAborted()
		const preparedPlayer = nextPlayer
		nextPlayer.onstop = () => {
			if (player === preparedPlayer) isPlaying.value = false
		}
		player = nextPlayer
		reverbEffect = nextFilter
		nextPlayer = null
		nextFilter = null
		isConverted.value = true
	} catch (error) {
		if (!disposed && !controller.signal.aborted) {
			errorMessage.value =
				error instanceof Error && /20 minute/.test(error.message)
					? error.message
					: 'The audio could not be prepared. Try another supported file.'
		}
	} finally {
		nextPlayer?.dispose()
		nextFilter?.dispose()
		operation = null
		isLoading.value = false
	}
}

async function togglePlayback() {
	const current = player
	if (!current || isLoading.value) return
	try {
		const Tone = await import('tone')
		await Tone.start()
		if (disposed || player !== current || isLoading.value) return
		if (isPlaying.value) {
			current.stop()
			isPlaying.value = false
		} else {
			current.start()
			isPlaying.value = true
		}
	} catch {
		if (!disposed) errorMessage.value = 'Preview could not start in this browser.'
	}
}

async function download() {
	if (isLoading.value || !file.value || !player) return
	const controller = new AbortController()
	operation = controller
	const source = player.buffer.get()
	if (!source) {
		operation = null
		return
	}
	const filename = getDownloadFileName(file.value.name)
	const playbackRate = player.playbackRate
	const wet = reverbEffect?.wet.value ?? getWetMix(reverb.value)
	isLoading.value = true
	errorMessage.value = ''
	player.stop()
	isPlaying.value = false
	let context: import('tone').OfflineContext | null = null
	let renderPlayer: import('tone').Player | null = null
	let filter: import('tone').Reverb | null = null
	try {
		const Tone = await import('tone')
		controller.signal.throwIfAborted()
		// Explicit context keeps failed/cancelled renders away from the live preview context.
		context = new Tone.OfflineContext(
			source.numberOfChannels,
			getRenderDuration(source.duration, playbackRate),
			source.sampleRate,
		)
		renderPlayer = new Tone.Player({ context, url: source, playbackRate })
		filter = new Tone.Reverb({
			context,
			decay: REVERB_DECAY_SECONDS,
			preDelay: REVERB_PREDELAY_SECONDS,
			wet,
		}).toDestination()
		renderPlayer.connect(filter)
		await filter.ready
		controller.signal.throwIfAborted()
		renderPlayer.start(0)
		const buffer = await context.render()
		controller.signal.throwIfAborted()
		const audio = buffer.get()
		if (!audio) throw new Error('No rendered audio')
		const blob = btow(audio)
		const downloadUrl = URL.createObjectURL(new Blob([blob], { type: 'audio/wav' }))
		const link = document.createElement('a')
		link.href = downloadUrl
		link.download = filename
		link.click()
		// Give the browser a task to consume the download before revoking the URL.
		setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
	} catch {
		if (!disposed && !controller.signal.aborted)
			errorMessage.value = 'The WAV could not be rendered. Try a shorter audio file.'
	} finally {
		renderPlayer?.dispose()
		filter?.dispose()
		context?.dispose()
		operation = null
		isLoading.value = false
	}
}

function reset() {
	if (isLoading.value) return
	disposePlayer()
	releaseSourceUrl()
	sourceUrl.value = ''
	file.value = null
	isConverted.value = false
	errorMessage.value = ''
	slowdown.value = DEFAULT_SLOWDOWN_PERCENT
	reverb.value = DEFAULT_REVERB_LEVEL
}
onBeforeUnmount(() => {
	disposed = true
	cancelOperation()
	disposePlayer()
	releaseSourceUrl()
})
</script>
