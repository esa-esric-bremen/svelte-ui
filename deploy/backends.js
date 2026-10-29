// Robot systems the UI talks to, read from the robot configs (controller-web/data).
// Used by the nginx config (production) and the vite proxy (development), so both
// route /backend/<system_name>/... the same way.
import { readdirSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';

export const CONFIG_DIR = 'src/lib/data';

/** @returns {{system_name: string, web_command_port: number, web_telemetry_port: number}[]} */
export function readBackends(dir = CONFIG_DIR) {
	const backends = [];
	const usedPorts = new Map();
	for (const file of readdirSync(dir).filter((f) => /^config_.*\.yaml$/.test(f)).sort()) {
		const path = `${dir}/${file}`;
		const config = /** @type {Record<string, any>} */ (yaml.load(readFileSync(path, 'utf8')));
		if (!config || typeof config !== 'object') {
			throw new Error(`${path}: not a YAML mapping`);
		}
		const missing = ['system_name', 'web_command_port', 'web_telemetry_port'].filter(
			(key) => config[key] === undefined
		);
		if (missing.length) {
			throw new Error(`${path}: missing required key(s) ${missing.join(', ')}`);
		}
		if (!/^[A-Za-z0-9_-]+$/.test(config.system_name)) {
			throw new Error(`${path}: system_name '${config.system_name}' must only use letters, digits, _ and -`);
		}
		for (const key of ['web_command_port', 'web_telemetry_port']) {
			const port = config[key];
			if (!Number.isInteger(port) || port < 1 || port > 65535) {
				throw new Error(`${path}: ${key} must be a port number, got '${port}'`);
			}
			if (usedPorts.has(port)) {
				throw new Error(`${path}: ${key} ${port} already used by ${usedPorts.get(port)}`);
			}
			usedPorts.set(port, `${file} (${key})`);
		}
		backends.push({
			system_name: config.system_name,
			web_command_port: config.web_command_port,
			web_telemetry_port: config.web_telemetry_port
		});
	}
	if (!backends.length) {
		throw new Error(`no config_*.yaml found in ${dir}`);
	}
	return backends;
}
