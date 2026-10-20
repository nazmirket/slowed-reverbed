import { afterEach, describe, expect, it, vi } from 'vitest'
import { readAudioDuration } from './audio-metadata'

class Media extends EventTarget {
	static last: Media
	duration = 12
	src = ''
	preload = ''
	load = vi.fn()
	removeAttribute = vi.fn(() => {
		this.src = ''
	})
	constructor() {
		super()
		Media.last = this
	}
}

afterEach(() => {
	vi.unstubAllGlobals()
	vi.useRealTimers()
})

describe('temporary audio metadata ownership', () => {
	it('returns duration and releases the media source', async () => {
		vi.stubGlobal('Audio', Media)
		const pending = readAudioDuration('blob:fixture', new AbortController().signal)
		const audio = Media.last
		audio.dispatchEvent(new Event('loadedmetadata'))
		await expect(pending).resolves.toBe(12)
		expect(audio.src).toBe('')
		expect(audio.load).toHaveBeenCalledTimes(1)
		audio.dispatchEvent(new Event('error'))
		expect(audio.load).toHaveBeenCalledTimes(1)
	})
	it('cancels without waiting for metadata and ignores late completion', async () => {
		vi.stubGlobal('Audio', Media)
		const controller = new AbortController()
		const pending = readAudioDuration('blob:fixture', controller.signal)
		controller.abort()
		await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
		Media.last.dispatchEvent(new Event('loadedmetadata'))
		expect(Media.last.load).toHaveBeenCalledTimes(1)
	})
	it('times out and releases a source that never produces metadata', async () => {
		vi.useFakeTimers()
		vi.stubGlobal('Audio', Media)
		const pending = readAudioDuration('blob:fixture', new AbortController().signal)
		const rejection = expect(pending).rejects.toThrow('timed out')
		await vi.advanceTimersByTimeAsync(15_000)
		await rejection
		expect(Media.last.src).toBe('')
		expect(vi.getTimerCount()).toBe(0)
	})
	it('releases a corrupt source on decoder error', async () => {
		vi.stubGlobal('Audio', Media)
		const pending = readAudioDuration('blob:fixture', new AbortController().signal)
		Media.last.dispatchEvent(new Event('error'))
		await expect(pending).rejects.toThrow('Unable to read')
		expect(Media.last.src).toBe('')
	})
})
