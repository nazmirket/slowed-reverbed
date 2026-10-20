import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests/browser',
	fullyParallel: false,
	workers: 1,
	use: { baseURL: 'http://127.0.0.1:9335', trace: 'retain-on-failure' },
	webServer: {
		command: 'pnpm preview',
		url: 'http://127.0.0.1:9335',
		reuseExistingServer: false,
	},
})
