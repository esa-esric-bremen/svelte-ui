import { addLogMessage, ui_state } from '#lib/state/ui.svelte';
import type IRobotRemoteControl from '#lib/interfaces/IRobotRemoteControl';
import type ILogMessage from '#lib/interfaces/ILogMessage';

const RECONNECT_MS = 500;
const MAX_HISTORY = 600;

interface TelemetryMessage {
	type: string;
	channel?: number;
	json: string;
}

// protobuf's JSON mapping omits fields holding default values (0, '', [])
interface SimpleSensor {
	header?: { timestamp?: { secs?: number; nsecs?: number } };
	value?: number[];
	valueNames?: string[];
}
interface SimpleActions {
	actions?: { name: string; state?: number }[];
}
interface LogMessage {
	level?: number;
	message?: string;
}

// RRC LogLevel: 1 FATAL, 2 ERROR, 3 WARN, 4 INFO, 5 DEBUG
function toLevel(level = 0): ILogMessage['level'] {
	if (level <= 2) return 'error';
	if (level == 3) return 'warning';
	return 'info';
}

export default class RrcClient {
	private websocket?: WebSocket;
	private readonly base: string;

	constructor(private readonly system_name: string) {
		this.base = `/backend/${system_name}`;
	}

	connect() {
		const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
		this.websocket = new WebSocket(`${protocol}://${location.host}${this.base}/ws`);
		this.websocket.onmessage = (ev) => this.handleMessage(JSON.parse(ev.data));
		this.websocket.onclose = () => {
			addLogMessage(`${this.system_name}: telemetry connection closed`, 'error');
			setTimeout(() => this.connect(), RECONNECT_MS);
		};
	}

	setSimpleAction(name: string, state: number) {
		this.sendCommand('SIMPLE_ACTIONS_COMMAND', { name, state });
	}

	setTwist(linear_x: number, angular_z: number) {
		this.sendCommand('TWIST_COMMAND', { linear: { x: linear_x }, angular: { z: angular_z } });
	}

	private sendCommand(type: string, payload: object) {
		fetch(`${this.base}/api/command`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type, json: JSON.stringify(payload) })
		})
			.then((res) => {
				if (!res.ok) addLogMessage(`${this.system_name}: ${type} failed (${res.status})`);
			})
			.catch((e) => addLogMessage(`${this.system_name}: ${type} failed (${e})`));
	}

	private state(): IRobotRemoteControl {
		ui_state.rrc[this.system_name] ??= { action_values: {}, sensor_values: {}, sensor_value: {} };
		return ui_state.rrc[this.system_name];
	}

	private handleMessage(message: TelemetryMessage) {
		const data = JSON.parse(message.json);
		switch (message.type) {
			case 'SIMPLE_SENSOR':
				this.handleSensor(data);
				break;
			case 'SIMPLE_ACTIONS':
				this.handleActions(data);
				break;
			case 'LOG_MESSAGE':
				this.handleLog(data);
				break;
		}
	}

	private handleSensor(sensor: SimpleSensor) {
		const state = this.state();
		const names = sensor.valueNames ?? [];
		const values = sensor.value ?? [];
		const ts = sensor.header?.timestamp;
		const time = ts ? new Date((ts.secs ?? 0) * 1000 + (ts.nsecs ?? 0) / 1e6) : new Date();
		names.forEach((id, i) => {
			const value = values[i] ?? 0;
			state.sensor_value[id] = value;
			const history = (state.sensor_values[id] ??= []);
			history.push([value, time]);
			if (history.length > MAX_HISTORY) history.shift();
		});
	}

	private handleActions(actions: SimpleActions) {
		const state = this.state();
		for (const action of actions.actions ?? []) {
			state.action_values[action.name] = action.state ?? 0;
		}
	}

	private handleLog(log: LogMessage) {
		addLogMessage(`${this.system_name}: ${log.message ?? ''}`, toLevel(log.level));
	}
}
