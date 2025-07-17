module.exports = {
	apps: [
		{
			name: 'sr',
			port: '9333',
			exec_mode: 'cluster',
			instances: 'max',
			script: './.output/server/index.mjs',
		},
	],
}
