import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['.nuxt/**', '.output/**', 'coverage/**', 'node_modules/**'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				extraFileExtensions: ['.vue'],
				parser: tseslint.parser,
				sourceType: 'module',
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
		},
	},
	{
		files: ['**/*.{js,mjs,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	eslintConfigPrettier,
)
