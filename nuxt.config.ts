import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'Slowed and Reverbed Maker',
			meta: [
				{
					charset: 'utf-8',
				},
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
				{
					name: 'description',
					content:
						'Create slowed and reverbed versions of your audio privately in the browser.',
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

	css: ['~/assets/css/style.css'],

	ssr: false,

	devServer: {
		port: 9333,
	},

	vite: {
		plugins: [tailwindcss()],
	},
})
