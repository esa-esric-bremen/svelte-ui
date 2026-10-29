import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import { readBackends } from './deploy/backends.js';

// Development only (npm run dev): the same routes as the production nginx
// (deploy/nginx-config.js), so the browser only talks to this origin:
//   /backend/<system_name>/api/... -> http://<host>:<web_command_port>/api/...
//   /backend/<system_name>/ws      -> ws://<host>:<web_telemetry_port>
function rrcProxies(host: string): Record<string, ProxyOptions> {
	const proxies: Record<string, ProxyOptions> = {};
	for (const backend of readBackends()) {
		const prefix = `/backend/${backend.system_name}`;
		proxies[`${prefix}/api`] = {
			target: `http://${host}:${backend.web_command_port}`,
			rewrite: (path) => path.slice(prefix.length)
		};
		proxies[`${prefix}/ws`] = {
			target: `ws://${host}:${backend.web_telemetry_port}`,
			ws: true,
			rewrite: () => '/'
		};
	}
	return proxies;
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const proxy = rrcProxies(env.VITE_BACKEND_URI || '127.0.0.1');
	return {
		plugins: [
			sveltekit({
				// Consult https://svelte.dev/docs/kit/integrations
				// for more information about preprocessors
				preprocess: vitePreprocess(),

				// static single page app, served by nginx in production (see Dockerfile)
				adapter: adapter({ fallback: 'index.html' })
			})
		],
		server: { proxy }
	};
});
