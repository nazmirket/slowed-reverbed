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
import { computed, onBeforeUnmount, ref } from 'vue'
import {
	DEFAULT_REVERB_LEVEL,
	DEFAULT_SLOWDOWN_PERCENT,
	MAX_REVERB_LEVEL,
	MAX_SLOWDOWN_PERCENT,
	MIN_REVERB_LEVEL,
	MIN_SLOWDOWN_PERCENT,
	REVERB_DECAY_SECONDS,
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

async function convert() {
	if (isLoading.value || !file.value || !sourceUrl.value) return
	isLoading.value = true
	errorMessage.value = ''
	isConverted.value = false
	disposePlayer()
	let nextPlayer: import('tone').Player | null = null
	let nextFilter: import('tone').Reverb | null = null
	try {
		const sourceDuration = await getSourceDuration()
		const durationError = validateAudioDuration(sourceDuration)
		if (durationError) {
			errorMessage.value = durationError
			return
		}
		const Tone = await import('tone')
		await Tone.start()
		nextPlayer = new Tone.Player().toDestination()
		await nextPlayer.load(sourceUrl.value)
		nextPlayer.playbackRate = getPlaybackRate(slowdown.value)
		nextFilter = new Tone.Reverb({
			decay: REVERB_DECAY_SECONDS,
			wet: getWetMix(reverb.value),
		}).toDestination()
		nextPlayer.connect(nextFilter)
		nextPlayer.onstop = () => {
			if (player === nextPlayer) isPlaying.value = false
		}
		player = nextPlayer
		reverbEffect = nextFilter
		isConverted.value = true
	} catch {
		nextPlayer?.stop()
		nextPlayer?.dispose()
		nextFilter?.dispose()
		errorMessage.value = 'The audio could not be prepared. Try another supported file.'
	} finally {
		isLoading.value = false
	}
}

async function togglePlayback() {
	if (!player) return
	try {
		const Tone = await import('tone')
		await Tone.start()
		if (isPlaying.value) {
			player.stop()
			isPlaying.value = false
		} else {
			player.start()
			isPlaying.value = true
		}
	} catch {
		errorMessage.value = 'Preview could not start in this browser.'
	}
}

async function getSourceDuration(): Promise<number> {
	if (!sourceUrl.value) throw new Error('No source audio selected.')
	return await new Promise((resolve, reject) => {
		const audio = new Audio(sourceUrl.value)
		audio.addEventListener('loadedmetadata', () => resolve(audio.duration), {
			once: true,
		})
		audio.addEventListener(
			'error',
			() => reject(new Error('Unable to read audio duration.')),
			{ once: true },
		)
	})
}

async function download() {
	if (isLoading.value || !file.value || !sourceUrl.value) return
	isLoading.value = true
	errorMessage.value = ''
	try {
		const [{ Offline, Player, Reverb }, sourceDuration] = await Promise.all([
			import('tone'),
			getSourceDuration(),
		])
		const durationError = validateAudioDuration(sourceDuration)
		if (durationError) {
			errorMessage.value = durationError
			return
		}
		const renderDuration = getRenderDuration(
			sourceDuration,
			getPlaybackRate(slowdown.value),
		)
		const buffer = await Offline(
			async () => {
				const renderPlayer = new Player()
				renderPlayer.playbackRate = getPlaybackRate(slowdown.value)
				const filter = new Reverb({
					decay: REVERB_DECAY_SECONDS,
					wet: getWetMix(reverb.value),
				}).toDestination()
				renderPlayer.connect(filter)
				await renderPlayer.load(sourceUrl.value)
				renderPlayer.start()
			},
			renderDuration,
			1,
		)
		const blob = btow(buffer as never)
		const downloadUrl = URL.createObjectURL(new Blob([blob], { type: 'audio/wav' }))
		const link = document.createElement('a')
		link.href = downloadUrl
		link.download = getDownloadFileName(file.value.name)
		link.click()
		URL.revokeObjectURL(downloadUrl)
	} catch {
		errorMessage.value = 'The WAV could not be rendered. Try a shorter audio file.'
	} finally {
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
	disposePlayer()
	releaseSourceUrl()
})
</script>
