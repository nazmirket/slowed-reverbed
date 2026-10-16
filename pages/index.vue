<template>
	<main class="min-h-screen px-6 py-12 text-slate-700 sm:px-10">
		<div class="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
			<header class="flex flex-col items-center gap-4">
				<img class="h-16 w-16" src="/favicon.png" alt="Slowed and Reverbed logo" />
				<div>
					<p class="text-2xl font-black">Better when</p>
					<h1 class="text-lg tracking-[0.55em]">slowed and reverbed</h1>
				</div>
			</header>

			<section class="flex w-full flex-col items-center gap-6" aria-labelledby="editor-title">
				<h2 id="editor-title" class="sr-only">Audio editor</h2>
				<input
					ref="fileInput"
					class="sr-only"
					type="file"
					accept="audio/*,.aac,.flac,.m4a,.mp3,.mp4,.oga,.ogg,.opus,.wav,.wave,.webm"
					@change="handleFileChange"
				/>

				<button
					type="button"
					class="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
					:disabled="isLoading"
					@click="fileInput?.click()"
				>
					{{ file ? 'Choose another file' : 'Select a file' }}
				</button>

				<p v-if="file" class="rounded-full bg-slate-600 px-6 py-3 text-white">
					{{ file.name }}
				</p>

				<div v-if="file && !isConverted" class="grid w-full max-w-md gap-4 text-left">
					<label class="rounded-xl border px-4 py-3">
						<span class="mb-2 block font-semibold">Slowed: {{ slowdown }}%</span>
						<input
							v-model.number="slowdown"
							class="w-full accent-purple-600"
							type="range"
							:min="MIN_SLOWDOWN_PERCENT"
							:max="MAX_SLOWDOWN_PERCENT"
							:aria-label="`Slowdown percentage: ${slowdown}`"
						/>
					</label>
					<label class="rounded-xl border px-4 py-3">
						<span class="mb-2 block font-semibold">Reverb: {{ reverb }}</span>
						<input
							v-model.number="reverb"
							class="w-full accent-purple-600"
							type="range"
							:min="MIN_REVERB_LEVEL"
							:max="MAX_REVERB_LEVEL"
							:aria-label="`Reverb level: ${reverb}`"
						/>
					</label>
					<button
						type="button"
						class="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
						:disabled="isLoading"
						@click="convert"
					>
						{{ isLoading ? 'Preparing audio…' : 'Convert' }}
					</button>
				</div>

				<div v-if="isConverted" class="flex flex-wrap justify-center gap-4">
					<button
						type="button"
						class="rounded-full border-4 border-purple-300 p-5 transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-200"
						:disabled="isLoading"
						:aria-label="isPlaying ? 'Pause preview' : 'Play preview'"
						@click="togglePlayback"
					>
						<img v-if="!isPlaying" class="h-6 w-6" src="/play.svg" alt="" />
						<img v-else class="h-6 w-6" src="/pause.svg" alt="" />
					</button>
					<button
						type="button"
						class="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
						:disabled="isLoading"
						@click="download"
					>
						{{ isLoading ? 'Rendering…' : 'Download WAV' }}
					</button>
					<button
						type="button"
						class="rounded-full border px-5 py-3 font-semibold transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
						:disabled="isLoading"
						@click="reset"
					>
						Start over
					</button>
				</div>

				<p v-if="errorMessage" class="w-full max-w-md rounded-xl bg-red-50 px-4 py-3 text-left text-red-700" role="alert">
					{{ errorMessage }}
				</p>
				<p class="text-sm text-slate-500" aria-live="polite">
					{{ statusMessage }}
				</p>
			</section>

			<footer class="text-sm text-slate-500">
				Made by
				<a class="text-indigo-600 hover:underline" href="https://github.com/nazmirket">@nazmirket</a>
			</footer>
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
	if (isConverted.value) return 'Ready to preview or download. Your file stays on this device.'
	if (file.value) return 'Choose your settings, then convert the audio.'
	return 'Choose an audio file to begin. Files are processed locally in your browser.'
})

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
		audio.addEventListener('loadedmetadata', () => resolve(audio.duration), { once: true })
		audio.addEventListener('error', () => reject(new Error('Unable to read audio duration.')), { once: true })
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
		const renderDuration = getRenderDuration(sourceDuration, getPlaybackRate(slowdown.value))

		const buffer = await Offline(async () => {
			const renderPlayer = new Player()
			renderPlayer.playbackRate = getPlaybackRate(slowdown.value)
			const filter = new Reverb({
				decay: REVERB_DECAY_SECONDS,
				wet: getWetMix(reverb.value),
			}).toDestination()
			renderPlayer.connect(filter)
			await renderPlayer.load(sourceUrl.value)
			renderPlayer.start()
		}, renderDuration, 1)
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
