// Totals for the overview screen, counted from the telemetry of every system
// with an `overview:` section in its config. Kept in the browser (localStorage)
// so a reload does not lose them, until the operator resets them.

import type IConfig from '#lib/interfaces/IConfig.js';

const STORAGE_KEY = 'esa-src-totals-v1';
const SAVE_INTERVAL_MS = 5000;
// longer gaps (connection lost) are not integrated, the power in between is unknown
const MAX_ENERGY_GAP_S = 5;
const DEFAULT_WEIGHT_NOISE_G = 100;

interface Totals {
	excavated_g: number;
	energy_wh: number;
	since: string; // ISO time of the last reset
	// last counted scale value per system, kept so material excavated while the UI
	// was closed is counted on the next start (only increases count anyway)
	weight_reference: { [system_name: string]: number };
}

// per system, not persisted: energy in a gap is unknown
interface Tracker {
	last_power?: { watts: number; time: number };
}

function load(): Totals {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { weight_reference: {}, ...JSON.parse(stored) };
		}
	} catch {
		// unavailable or broken storage: start new
	}
	return { excavated_g: 0, energy_wh: 0, since: new Date().toISOString(), weight_reference: {} };
}

export const totals = $state<Totals>(load());

const trackers: { [system_name: string]: Tracker } = {};
let last_save = 0;

function save(force = false) {
	const now = Date.now();
	if (!force && now - last_save < SAVE_INTERVAL_MS) return;
	last_save = now;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(totals));
	} catch {
		// the totals stay correct in memory
	}
}

export function resetTotals() {
	totals.excavated_g = 0;
	totals.energy_wh = 0;
	totals.since = new Date().toISOString();
	// start counting from what is in the container now
	totals.weight_reference = {};
	for (const tracker of Object.values(trackers)) {
		delete tracker.last_power;
	}
	save(true);
}

// values: sensor id -> value of one telemetry message
export function updateTotals(config: IConfig, values: { [id: string]: number }, time: Date) {
	const overview = config.overview;
	if (!overview) return;
	const tracker = (trackers[config.system_name] ??= {});

	const weight = overview.weight_sensor ? values[overview.weight_sensor] : undefined;
	if (weight !== undefined) {
		// ratchet: material counts when the scale rises clearly above the reference,
		// unloading (screw) only moves the reference down
		const band = overview.weight_noise_g ?? DEFAULT_WEIGHT_NOISE_G;
		const reference = totals.weight_reference[config.system_name];
		if (reference === undefined || weight < reference - band) {
			totals.weight_reference[config.system_name] = weight;
		} else if (weight > reference + band) {
			totals.excavated_g += weight - reference;
			totals.weight_reference[config.system_name] = weight;
		}
	}

	const voltage = overview.voltage_sensor ? values[overview.voltage_sensor] : undefined;
	const current = overview.current_sensor ? values[overview.current_sensor] : undefined;
	if (voltage !== undefined && current !== undefined) {
		const watts = voltage * current;
		const t = time.getTime();
		const last = tracker.last_power;
		if (last && t > last.time && (t - last.time) / 1000 <= MAX_ENERGY_GAP_S) {
			// trapezoid
			totals.energy_wh += (((last.watts + watts) / 2) * (t - last.time)) / 3_600_000;
		}
		tracker.last_power = { watts, time: t };
	}
	save();
}
