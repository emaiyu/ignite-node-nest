import swc from 'unplugin-swc';
import tsConfigPaths from 'vitest-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		root: './',
	},
	plugins: [
		tsConfigPaths(),
		// This is required to build the test files with SWC
		swc.vite({
			// Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
			module: { type: 'es6' },
		}),
	],
	// resolve: {
	// 	alias: {
	// 		// Ensure Vitest correctly resolves TypeScript path aliases
	// 		'@/app': resolve(__dirname, './src'),
	// 		'@/test': resolve(__dirname, './test'),
	// 	},
	// },
});
