export const DEFAULT_SLOWDOWN_PERCENT = 15
export const DEFAULT_REVERB_LEVEL = 3
export const MIN_SLOWDOWN_PERCENT = 5
export const MAX_SLOWDOWN_PERCENT = 60
export const MIN_REVERB_LEVEL = 1
export const MAX_REVERB_LEVEL = 10
export const REVERB_DECAY_SECONDS = 10
export const REVERB_PREDELAY_SECONDS = 0.01
export const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024
export const MAX_AUDIO_DURATION_SECONDS = 20 * 60

const SUPPORTED_AUDIO_EXTENSION = /\.(aac|flac|m4a|mp3|mp4|oga|ogg|opus|wav|wave|webm)$/i

type AudioFileDetails = Pick<File, 'name' | 'size' | 'type'>

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum)
}

export function getPlaybackRate(slowdownPercent: number): number {
	const safePercentage = clamp(
		slowdownPercent,
		MIN_SLOWDOWN_PERCENT,
		MAX_SLOWDOWN_PERCENT,
	)

	return (100 - safePercentage) / 100
}

export function getWetMix(reverbLevel: number): number {
	return clamp(reverbLevel, MIN_REVERB_LEVEL, MAX_REVERB_LEVEL) / 10
}

export function getRenderDuration(
	sourceDuration: number,
	playbackRate: number,
	reverbTail = REVERB_DECAY_SECONDS + REVERB_PREDELAY_SECONDS,
): number {
	if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) {
		throw new Error('The source duration must be a positive number.')
	}

	if (!Number.isFinite(playbackRate) || playbackRate <= 0) {
		throw new Error('The playback rate must be a positive number.')
	}

	return sourceDuration / playbackRate + Math.max(0, reverbTail)
}

export function validateAudioFile(file: AudioFileDetails): string | null {
	const isSupportedType =
		file.type.startsWith('audio/') || SUPPORTED_AUDIO_EXTENSION.test(file.name)

	if (!isSupportedType) {
		return 'Choose a supported audio file such as MP3, WAV, M4A, FLAC, OGG, or WebM.'
	}

	if (file.size <= 0) {
		return 'The selected file is empty.'
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		return 'The selected file is larger than the 150 MB browser-processing limit.'
	}

	return null
}

export function validateAudioDuration(duration: number): string | null {
	if (!Number.isFinite(duration) || duration <= 0) {
		return 'Unable to read the selected audio duration.'
	}

	if (duration > MAX_AUDIO_DURATION_SECONDS) {
		return 'The selected audio is longer than the 20 minute browser-processing limit.'
	}

	return null
}

export function getDownloadFileName(sourceName: string): string {
	const baseName = sourceName.replace(/\.[^/.]+$/, '').trim() || 'audio'
	return `${baseName}-slowed-reverbed.wav`
}
