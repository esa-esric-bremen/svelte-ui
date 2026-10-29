import { browser } from '$app/env';
import configs from '#lib/configs.js';
import RrcClient from './RrcClient.js';

const clients: { [system_name: string]: RrcClient } = {};

// One connection per system, opened on first use.
export function rrc(system_name: string): RrcClient {
	if (!browser) {
		throw new Error('rrc() is only available in the browser');
	}
	if (!clients[system_name]) {
		const config = Object.values(configs).find((c) => c.system_name === system_name);
		if (!config) {
			throw new Error(`unknown system '${system_name}'`);
		}
		clients[system_name] = new RrcClient(config);
		clients[system_name].start();
	}
	return clients[system_name];
}

// Connect to every system at app start, so the log shows what is connected and
// the overview totals are counted no matter which page is open.
export function startAll() {
	for (const config of Object.values(configs)) {
		rrc(config.system_name);
	}
}
