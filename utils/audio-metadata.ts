// Read duration before decoding a potentially large file. Always release the
// temporary media element, including cancellation, decoder errors and timeouts.
export function readAudioDuration(url: string, signal: AbortSignal): Promise<number> {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(signal.reason)
			return
		}
		const audio = new Audio()
		const finish = (error?: unknown) => {
			clearTimeout(timer)
			audio.removeEventListener('loadedmetadata', loaded)
			audio.removeEventListener('error', failed)
			signal.removeEventListener('abort', aborted)
			const duration = audio.duration
			audio.removeAttribute('src')
			audio.load()
			if (error) reject(error)
			else resolve(duration)
		}
		const loaded = () => finish()
		const failed = () => finish(new Error('Unable to read audio duration.'))
		const aborted = () => finish(signal.reason)
		const timer = setTimeout(() => finish(new Error('Audio metadata timed out.')), 15_000)
		audio.addEventListener('loadedmetadata', loaded)
		audio.addEventListener('error', failed)
		signal.addEventListener('abort', aborted, { once: true })
		audio.preload = 'metadata'
		audio.src = url
	})
}
