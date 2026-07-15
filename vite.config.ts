import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	console.log(`> Backend: ws://${env.VITE_BACKEND_URI}/`)
	return {
		plugins: [sveltekit()],
		envPrefix: 'VITE_',
		envDir: './',
		server: {
			proxy: {
				"/ws": {
					target: `ws://${env.VITE_BACKEND_URI}/`,
					changeOrigin: true,
					ws: true
				}
			}
		}
	}
});
