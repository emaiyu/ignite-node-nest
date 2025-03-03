import { resolve } from 'path';
import swc from 'unplugin-swc';
import tsConfigPaths from 'vitest-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		root: './',
		include: ['**/*.e2e-spec.ts'],
		setupFiles: ['./test/setup-e2e.ts'],
	},
	plugins: [
		tsConfigPaths(),
		// This is required to build the test files with SWC
		swc.vite({
			// Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
			module: { type: 'es6' },
		}),
	],
	resolve: {
		// alias: {
		// 	// Ensure Vitest correctly resolves TypeScript path aliases
		// 	src: resolve(__dirname, './src'),
		// },
		alias: [
			{
				find: '@',
				replacement: resolve(__dirname, './src'),
			},
			{
				find: '@',
				replacement: resolve(__dirname, './test'),
			},
		],
	},
});
