import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// Independent PCM fixture: different frequencies in left and right channels.
function stereoWav() {
	const rate = 8000,
		frames = rate / 2
	const wav = Buffer.alloc(44 + frames * 4)
	wav.write('RIFF')
	wav.writeUInt32LE(wav.length - 8, 4)
	wav.write('WAVEfmt ', 8)
	wav.writeUInt32LE(16, 16)
	wav.writeUInt16LE(1, 20)
	wav.writeUInt16LE(2, 22)
	wav.writeUInt32LE(rate, 24)
	wav.writeUInt32LE(rate * 4, 28)
	wav.writeUInt16LE(4, 32)
	wav.writeUInt16LE(16, 34)
	wav.write('data', 36)
	wav.writeUInt32LE(frames * 4, 40)
	for (let i = 0; i < frames; i++) {
		wav.writeInt16LE(
			Math.round(3000 * Math.sin((2 * Math.PI * 220 * i) / rate)),
			44 + i * 4,
		)
		wav.writeInt16LE(
			Math.round(3000 * Math.sin((2 * Math.PI * 440 * i) / rate)),
			46 + i * 4,
		)
	}
	return { name: 'stereo.wav', mimeType: 'audio/wav', buffer: wav }
}

test('preview, stereo export, cleanup and corrupt-file recovery stay local', async ({
	page,
}, info) => {
	const errors: string[] = [],
		unexpectedRequests: string[] = []
	page.on('pageerror', error => errors.push(error.message))
	page.on('request', request => {
		if (
			!['GET', 'HEAD'].includes(request.method()) ||
			!/^(http:\/\/127\.0\.0\.1:9335\/|blob:|data:)/.test(request.url())
		)
			unexpectedRequests.push(request.url())
	})
	await page.addInitScript(() => {
		const active = new Set<string>()
		const create = URL.createObjectURL.bind(URL),
			revoke = URL.revokeObjectURL.bind(URL)
		URL.createObjectURL = value => {
			const url = create(value)
			if (value instanceof File || (value instanceof Blob && value.type === 'audio/wav'))
				active.add(url)
			return url
		}
		URL.revokeObjectURL = url => {
			active.delete(url)
			revoke(url)
		}
		Object.assign(window, { activeObjectUrls: active })
	})
	await page.goto('/')
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.getByText('Your version is ready')).toBeVisible()
	await page.getByRole('button', { name: 'Play preview' }).click()
	await expect(page.getByRole('button', { name: 'Pause preview' })).toBeVisible()
	await page.getByRole('button', { name: 'Pause preview' }).click()
	const downloadPromise = page.waitForEvent('download')
	await page.getByRole('button', { name: 'Download WAV' }).click()
	const download = await downloadPromise
	expect(download.suggestedFilename()).toBe('stereo-slowed-reverbed.wav')
	await download.saveAs(info.outputPath('stereo-export.wav'))
	const bytes = await readFile((await download.path())!)
	expect(bytes.toString('ascii', 0, 4)).toBe('RIFF')
	expect(bytes.readUInt16LE(22)).toBe(2)
	const duration = bytes.readUInt32LE(40) / bytes.readUInt32LE(28)
	expect(duration).toBeCloseTo(0.5 / 0.85 + 10.01, 2)
	let different = false,
		audible = false
	for (let i = 44; i < bytes.length; i += 4) {
		if (bytes.readInt16LE(i) !== bytes.readInt16LE(i + 2)) different = true
		if (Math.abs(bytes.readInt16LE(i)) > 100) audible = true
	}
	expect(different).toBe(true)
	expect(audible).toBe(true)
	await page.screenshot({ path: info.outputPath('desktop-result.png'), fullPage: true })
	await page.getByRole('button', { name: 'Start over' }).click()
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					(window as unknown as { activeObjectUrls: Set<string> }).activeObjectUrls.size,
			),
		)
		.toBe(0)
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles({
		name: 'broken.wav',
		mimeType: 'audio/wav',
		buffer: Buffer.from('not audio'),
	})
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.locator('.error-message[role=alert]')).toContainText(
		'could not be prepared',
	)
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.getByText('Your version is ready')).toBeVisible()
	await page.setViewportSize({ width: 390, height: 844 })
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.evaluate(() => window.scrollTo(0, 0))
	await expect
		.poll(async () => {
			const box = await page.locator('.workbench').boundingBox()
			return !!box && box.x >= 0 && box.x + box.width <= 390
		})
		.toBe(true)
	await page.screenshot({ path: info.outputPath('mobile-result.png'), fullPage: true })
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
	).toBe(true)
	expect(errors).toEqual([])
	expect(unexpectedRequests).toEqual([])
})

test('cancelled preparation cannot publish late success', async ({ page }) => {
	await page.addInitScript(() => {
		const decode = AudioContext.prototype.decodeAudioData
		AudioContext.prototype.decodeAudioData = function (...args) {
			return new Promise((resolve, reject) => {
				Object.assign(window, {
					releaseDecode: () => decode.apply(this, args).then(resolve, reject),
				})
			})
		}
	})
	await page.goto('/')
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await page.waitForFunction(() => 'releaseDecode' in window)
	await page.getByRole('button', { name: 'Cancel processing' }).click()
	await page.evaluate(() =>
		(window as unknown as { releaseDecode: () => void }).releaseDecode(),
	)
	await expect(page.getByRole('button', { name: 'Create my version' })).toBeEnabled()
	await expect(page.getByText('Your version is ready')).not.toBeVisible()
	await expect(page.locator('.error-message[role=alert]')).not.toBeVisible()
})

test('cancelled metadata probe releases the UI and ignores late metadata', async ({
	page,
}) => {
	await page.addInitScript(() => {
		const NativeAudio = window.Audio
		let first = true
		class PendingAudio extends EventTarget {
			duration = 0.5
			src = ''
			preload = ''
			removeAttribute() {
				this.src = ''
			}
			load() {}
		}
		Object.assign(window, {
			Audio: function () {
				if (!first) return new NativeAudio()
				first = false
				const pending = new PendingAudio()
				Object.assign(window, { releaseMetadata: () => pending.dispatchEvent(new Event('loadedmetadata')) })
				return pending
			},
		})
	})
	await page.goto('/')
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await page.waitForFunction(() => 'releaseMetadata' in window)
	await page.getByRole('button', { name: 'Cancel processing' }).click()
	await expect(page.getByRole('button', { name: 'Create my version' })).toBeEnabled()
	await page.evaluate(() =>
		(window as unknown as { releaseMetadata: () => void }).releaseMetadata(),
	)
	await expect(page.getByText('Your version is ready')).not.toBeVisible()
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.getByText('Your version is ready')).toBeVisible()
})

test('decoded duration over the limit rejects a misleading short metadata reading', async ({
	page,
}) => {
	await page.addInitScript(() => {
		const original = Object.getOwnPropertyDescriptor(AudioBuffer.prototype, 'duration')!
		let spoofDuration = true
		Object.defineProperty(AudioBuffer.prototype, 'duration', {
			configurable: true,
			get() {
				return spoofDuration ? 20 * 60 + 1 : original.get!.call(this)
			},
		})
		Object.assign(window, { restoreDecodedDuration: () => (spoofDuration = false) })
	})
	await page.goto('/')
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.locator('.error-message[role=alert]')).toContainText('20 minute')
	await expect(page.getByText('Your version is ready')).not.toBeVisible()
	await page.evaluate(() =>
		(window as unknown as { restoreDecodedDuration: () => void }).restoreDecodedDuration(),
	)
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.getByText('Your version is ready')).toBeVisible()
})

test('cancelled export produces no download and the next export succeeds', async ({
	page,
}) => {
	await page.addInitScript(() => {
		const render = OfflineAudioContext.prototype.startRendering
		let delayed = false
		OfflineAudioContext.prototype.startRendering = function () {
			if (!delayed && this.length / this.sampleRate > 10.1) {
				delayed = true
				return new Promise((resolve, reject) => {
					Object.assign(window, {
						releaseRender: () => render.call(this).then(resolve, reject),
					})
				})
			}
			return render.call(this)
		}
	})
	await page.goto('/')
	await page.getByLabel('Audio source file', { exact: true }).setInputFiles(stereoWav())
	await page.getByRole('button', { name: 'Create my version' }).click()
	await expect(page.getByText('Your version is ready')).toBeVisible()
	let downloads = 0
	page.on('download', () => downloads++)
	await page.getByRole('button', { name: 'Download WAV' }).click()
	await page.waitForFunction(() => 'releaseRender' in window)
	await page.getByRole('button', { name: 'Cancel processing' }).click()
	await page.evaluate(() =>
		(window as unknown as { releaseRender: () => void }).releaseRender(),
	)
	await expect(page.getByRole('button', { name: 'Download WAV' })).toBeEnabled()
	expect(downloads).toBe(0)
	await page.getByRole('button', { name: 'Play preview' }).click()
	await expect(page.getByRole('button', { name: 'Pause preview' })).toBeVisible()
	const download = page.waitForEvent('download')
	await page.getByRole('button', { name: 'Download WAV' }).click()
	await download
	expect(downloads).toBe(1)
})
