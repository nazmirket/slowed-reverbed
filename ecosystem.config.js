module.exports = {
	apps: [
		{
			name: 'sr',
			port: '9333',
			exec_mode: 'cluster',
			instances: '1',
			script: './.output/server/index.mjs',
		},
	],
}
