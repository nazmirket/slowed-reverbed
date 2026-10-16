import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'Slowed & Reverbed — Private Browser Audio Studio',
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
						'Slow down and add reverb to MP3, WAV, M4A, FLAC, OGG, and more in a private browser audio studio. Processing stays on your device.',
				},
				{
					name: 'robots',
					content: 'index, follow, max-image-preview:large',
				},
				{
					name: 'theme-color',
					content: '#171521',
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					property: 'og:url',
					content: 'https://sr.mirket.dev/',
				},
				{
					property: 'og:title',
					content: 'Slowed & Reverbed — Private Browser Audio Studio',
				},
				{
					property: 'og:description',
					content:
						'Slow down songs, add atmosphere, and export a WAV. Your audio stays on this device.',
				},
				{
					property: 'og:image',
					content: 'https://sr.mirket.dev/og-image.png',
				},
				{
					property: 'og:image:width',
					content: '1200',
				},
				{
					property: 'og:image:height',
					content: '630',
				},
				{
					property: 'og:image:alt',
					content: 'Pink music notes on a deep violet background',
				},
				{
					property: 'og:site_name',
					content: 'Slowed & Reverbed',
				},
				{
					name: 'twitter:card',
					content: 'summary_large_image',
				},
				{
					name: 'twitter:title',
					content: 'Slowed & Reverbed — Private Browser Audio Studio',
				},
				{
					name: 'twitter:description',
					content:
						'Slow down songs, add atmosphere, and export a WAV in your browser.',
				},
				{
					name: 'twitter:image',
					content: 'https://sr.mirket.dev/og-image.png',
				},
			],
			link: [
				{
					rel: 'canonical',
					href: 'https://sr.mirket.dev/',
				},
				{
					rel: 'icon',
					type: 'image/png',
					href: '/favicon.png',
					sizes: '512x512',
				},
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/favicon.ico',
					sizes: '32x32',
				},
				{
					rel: 'apple-touch-icon',
					type: 'image/png',
					href: '/apple-touch-icon.png',
					sizes: '180x180',
				},
				{
					rel: 'manifest',
					href: '/site.webmanifest',
				},
			],
			script: [
				{
					type: 'application/ld+json',
					innerHTML: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebApplication',
						name: 'Slowed & Reverbed',
						url: 'https://sr.mirket.dev/',
						description:
							'Slow down and add reverb to audio privately in your browser, then export a WAV.',
						applicationCategory: 'MultimediaApplication',
						operatingSystem: 'Any',
						browserRequirements: 'Requires a modern browser with Web Audio API support.',
						featureList: [
							'Slow down audio locally',
							'Add reverb locally',
							'Export a WAV file',
						],
					}),
				},
			],
		},
	},

	css: ['~/assets/css/style.css'],

	ssr: true,

	devServer: {
		port: 9333,
	},

	vite: {
		plugins: [tailwindcss()],
	},
})
