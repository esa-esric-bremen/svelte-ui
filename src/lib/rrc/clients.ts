import { browser } from '$app/env';
import RrcClient from './RrcClient';

const clients: { [system_name: string]: RrcClient } = {};

// One connection per system, opened on first use.
export function rrc(system_name: string): RrcClient {
	if (!browser) {
		throw new Error('rrc() is only available in the browser');
	}
	if (!clients[system_name]) {
		clients[system_name] = new RrcClient(system_name);
		clients[system_name].connect();
	}
	return clients[system_name];
}
