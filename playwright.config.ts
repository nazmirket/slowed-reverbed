import { defineConfig } from '@playwright/test'
import { readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const chromiumPath = process.env.CI ? undefined : (() => {
	const profile = dirname(dirname(realpathSync(join(homedir(), '.local/bin/mirket'))))
	const binding = JSON.parse(readFileSync(join(profile, 'config/profile-binding.json'), 'utf8'))
	const video = JSON.parse(readFileSync(binding.videoConfig.path, 'utf8'))
	return video.chromium.path
})()

export default defineConfig({
	testDir: './tests/browser',
	fullyParallel: false,
	workers: 1,
	use: { baseURL: 'http://127.0.0.1:9335', trace: 'retain-on-failure', launchOptions: chromiumPath ? { executablePath: chromiumPath } : undefined },
	webServer: {
		command: `${process.execPath} node_modules/serve/build/main.js .output/public --listen tcp://127.0.0.1:9335`,
		url: 'http://127.0.0.1:9335',
		reuseExistingServer: false,
	},
})
