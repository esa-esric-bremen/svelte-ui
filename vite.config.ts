import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const CONFIG_DIR = 'src/lib/data';

function rrcProxies(host: string): Record<string, ProxyOptions> {
  const proxies: Record<string, ProxyOptions> = {};
  for (const file of readdirSync(CONFIG_DIR).filter((f: string) => /^config_.*\.yaml$/.test(f))) {
    const config = yaml.load(readFileSync(`${CONFIG_DIR}/${file}`, 'utf8')) as Record<string, unknown>;
    for (const key of ['system_name', 'web_command_port', 'web_telemetry_port']) {
      if (config[key] === undefined) {
        throw new Error(`${CONFIG_DIR}/${file}: missing required key '${key}'`);
      }
    }
    const prefix = `/backend/${config.system_name}`;
    proxies[`${prefix}/api`] = {
      target: `http://${host}:${config.web_command_port}`,
      rewrite: (path) => path.slice(prefix.length)
    };
    proxies[`${prefix}/ws`] = {
      target: `ws://${host}:${config.web_telemetry_port}`,
      ws: true,
      rewrite: () => '/'
    };
    console.log(`> ${config.system_name}: ${host}:${config.web_command_port} (http), ${host}:${config.web_telemetry_port} (ws)`);
  }
  return proxies;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxy = rrcProxies(env.VITE_BACKEND_URI || 'localhost');
  return {
    plugins: [sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },

      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter()
    })],
    server: { proxy },
    preview: { proxy }
  };
});
