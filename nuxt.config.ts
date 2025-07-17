import { defineNuxtConfig } from 'nuxt/config'
import eslint from 'vite-plugin-eslint'

export default defineNuxtConfig({
	app: {
		head: {
			title: 'Slowed and Reverb Maker',
			meta: [
				{
					charset: 'utf-8',
				},
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
				{
					hid: 'description',
					name: 'description',
					content: 'Slowed and Reverbed Maker',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/favicon.png',
				},
			],
		},
	},

	build: {},

	modules: ['@nuxtjs/tailwindcss'],

	ssr: false,

	devServer: {
		port: 9333,
	},

	typescript: {
		tsConfig: {
			include: ['~/types'],
		},
	},

	vite: {
		plugins: [eslint()],
	},

	tailwindcss: {
		cssPath: '~/assets/css/style.css',
		configPath: 'tailwind.config.js',
		injectPosition: 'first',
	},
})
