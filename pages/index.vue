<template>
	<div v-if="isLoading" class="loading-container">
		<span class="loading w-24 h-24 text-purple-600" />
	</div>
	<div class="min-h-screen flex justify-center items-center flex-col gap-16">
		<div class="flex justify-center items-center flex-col">
			<span class="p-6">
				<img src="/favicon.png" alt="logo" class="w-16 h-16" />
			</span>
			<div class="flex flex-col justify-center items-center">
				<span class="text-2xl font-900">Better when</span>
				<span class="text-lg" style="letter-spacing: 9px"> slowed and reverbed </span>
			</div>
		</div>

		<div class="flex flex-col">
			<input ref="FileInput" type="file" class="hidden" />
			<a
				v-if="!file"
				class="bg-purple-600 text-white px-8 py-3 rounded-full"
				@click.prevent=";(FileInput as any).click()"
			>
				<span> Select a File </span>
			</a>
		</div>

		<div v-if="file">
			<span class="bg-slate-600 text-white px-8 py-3 rounded-full">
				{{ file.name }}
			</span>
		</div>

		<div v-if="!isConverted && file" class="flex flex-col gap-6">
			<div class="border px-4 py-3 rounded-xl flex gap-4">
				<label class="font-600">Slowed</label>
				<input
					v-model="rate"
					type="range"
					class="range range-primary"
					:min="5"
					:max="60"
				/>
			</div>
			<div class="border px-4 py-3 rounded-xl flex gap-4">
				<label class="font-600">Reverb</label>
				<input
					v-model="reverb"
					type="range"
					class="range range-primary"
					:min="1"
					:max="10"
				/>
			</div>
			<button
				class="bg-purple-600 text-white px-8 py-3 rounded-full"
				:disabled="!file"
				@click="convert"
			>
				Convert
			</button>
		</div>

		<div v-if="isConverted" class="flex">
			<a
				:class="{ 'play-effect': onPlay }"
				class="border p-8 rounded-full cursor-pointer"
				@click="play"
			>
				<img v-if="!onPlay" class="w-6 h-6" src="/play.svg" alt="" />
				<img v-if="onPlay" class="w-6 h-6" src="/pause.svg" alt="" />
			</a>
		</div>

		<div v-if="isConverted">
			<a
				class="bg-purple-600 text-white px-8 py-3 rounded-full cursor-pointer"
				@click="download"
			>
				Download
			</a>
		</div>

		<div v-if="isConverted">
			<a href="">
				<img class="w-6 h-6" src="/reload.svg" alt="" />
			</a>
		</div>

		<div>
			Made by
			<a href="https://github.com/nazmirket" class="text-indigo-600">@nazmirket</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import btow from 'audiobuffer-to-wav'
import { Player, Reverb, Offline } from 'tone'

const isLoading = ref(false)

const file = ref()
const FileInput = ref(null)

const reverb = ref(3)
const rate = ref(15)

const onPlay = ref(false)
const isConverted = ref(false)
let audio: Player

onMounted(() => {
	if (!FileInput.value) return
	;(FileInput.value as HTMLInputElement).addEventListener('change', e => {
		file.value = (e?.target as any)?.files?.[0]
	})
})

const playbackRate = computed(() => {
	return (100 - rate.value) / 100
})

async function convert() {
	isLoading.value = true
	try {
		audio = new Player().toDestination()

		// Wait for the audio to load
		await audio.load(URL.createObjectURL(file.value))

		audio.playbackRate = playbackRate.value
		const filter = new Reverb({
			decay: 10,
			wet: reverb.value / 10,
		}).toDestination()
		audio.connect(filter)

		isConverted.value = true
	} catch (error) {}
	isLoading.value = false
}

function play() {
	if (!audio) return
	if (onPlay.value) {
		audio.stop()
		onPlay.value = false
	} else {
		audio.start()
		onPlay.value = true
	}
}

async function download() {
	isLoading.value = true
	let p
	const buffer = await Offline(
		async () => {
			p = new Player({ url: URL.createObjectURL(file.value) }).toDestination()
			p.playbackRate = playbackRate.value
			const filter = new Reverb({
				decay: 10,
				wet: reverb.value / 10,
			}).toDestination()
			p.connect(filter)
			while (!p.loaded) await new Promise(r => setTimeout(r, 1000))
			p.start()
		},
		(await getDuration()) / playbackRate.value,
		1
	)

	const blob = btow(buffer as any)

	const a = document.createElement('a')
	a.href = URL.createObjectURL(new Blob([blob], { type: 'audio/wav' }))
	a.download = 'slowed.wav'
	a.click()
	isLoading.value = false
}

function getDuration(): Promise<number> {
	return new Promise((resolve, reject) => {
		var reader = new FileReader()
		var el = document.createElement('audio')
		reader.onload = function (e) {
			el.src = e?.target?.result as string
			el.addEventListener('durationchange', () => resolve(el.duration), false)
			el.addEventListener('onerror', e => reject(e), false)
		}
		reader.readAsDataURL(file.value)
	})
}
</script>

<style lang="css">
.play-effect {
	animation: play 700ms infinite;
	border: 4px solid #a78bfa;
}

@keyframes play {
	0% {
		transform: scale(1);
	}
	20% {
		transform: scale(1.05);
	}
	40% {
		transform: scale(0.95);
	}
	50% {
		transform: scale(1.05);
	}
	60% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.95);
	}
}

.loading-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 1000;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
