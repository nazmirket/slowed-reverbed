module.exports = {
	apps: [
		{
			name: 'slowed-reverbed',
			port: 9333,
			exec_mode: 'cluster',
			instances: 1,
			script: './.output/server/index.mjs',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
