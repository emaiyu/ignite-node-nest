// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['eslint.config.mjs'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			'prettier/prettier': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
				},
			],
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowTypedFunctionExpressions: true,
				},
			],
			'import/order': [
				'error',
				{
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
					'newlines-between': 'always',
				},
			],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
		},
	},
	{
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
);
