import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 4203,
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
	},
	base: '/',
});