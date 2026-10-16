import { describe, expect, it } from 'vitest'
import {
	MAX_AUDIO_DURATION_SECONDS,
	MAX_FILE_SIZE_BYTES,
	getDownloadFileName,
	getPlaybackRate,
	getRenderDuration,
	getWetMix,
	validateAudioDuration,
	validateAudioFile,
} from './audio'

describe('audio settings', () => {
	it('converts slowdown percentages to bounded playback rates', () => {
		expect(getPlaybackRate(15)).toBe(0.85)
		expect(getPlaybackRate(-100)).toBe(0.95)
		expect(getPlaybackRate(100)).toBe(0.4)
	})

	it('converts reverb levels to a bounded wet mix', () => {
		expect(getWetMix(3)).toBe(0.3)
		expect(getWetMix(-1)).toBe(0.1)
		expect(getWetMix(20)).toBe(1)
	})

	it('includes the slowed duration and the reverb tail', () => {
		expect(getRenderDuration(120, 0.8, 10)).toBe(160)
	})

	it('rejects invalid render inputs', () => {
		expect(() => getRenderDuration(0, 0.8)).toThrow()
		expect(() => getRenderDuration(120, 0)).toThrow()
	})
})

describe('file validation', () => {
	it('accepts browser audio MIME types and known extensions', () => {
		expect(
			validateAudioFile({ name: 'song.bin', size: 1024, type: 'audio/mpeg' }),
		).toBeNull()
		expect(validateAudioFile({ name: 'recording.m4a', size: 1024, type: '' })).toBeNull()
	})

	it('rejects unsupported, empty, and oversized files', () => {
		expect(
			validateAudioFile({ name: 'notes.txt', size: 1024, type: 'text/plain' }),
		).toMatch(/supported audio file/)
		expect(validateAudioFile({ name: 'empty.mp3', size: 0, type: '' })).toMatch(/empty/)
		expect(
			validateAudioFile({
				name: 'huge.wav',
				size: MAX_FILE_SIZE_BYTES + 1,
				type: 'audio/wav',
			}),
		).toMatch(/150 MB/)
	})

	it('keeps the documented duration limit stable', () => {
		expect(MAX_AUDIO_DURATION_SECONDS).toBe(20 * 60)
	})

	it('rejects invalid and overlong audio durations', () => {
		expect(validateAudioDuration(0)).toMatch(/Unable to read/)
		expect(validateAudioDuration(Number.NaN)).toMatch(/Unable to read/)
		expect(validateAudioDuration(MAX_AUDIO_DURATION_SECONDS + 1)).toMatch(/20 minute/)
		expect(validateAudioDuration(MAX_AUDIO_DURATION_SECONDS)).toBeNull()
	})
})

describe('download naming', () => {
	it('preserves the original base name', () => {
		expect(getDownloadFileName('My Song.mp3')).toBe('My Song-slowed-reverbed.wav')
		expect(getDownloadFileName('.wav')).toBe('audio-slowed-reverbed.wav')
	})
})
