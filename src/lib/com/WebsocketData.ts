import type IRobotRemoteControl from "$lib/interfaces/IRobotRemoteControl";
import { ui_state, addLogMessage } from "$lib/state/ui.svelte";
import BaseCom from "./BaseCom";


const LOG_MESSAGE = 0;
const TELEMETRY_MESSAGE = 1;
const ACTION_MESSAGE = 2;


export default class WebsocketData extends BaseCom {
  constructor() {
    super(8000, 'ws');
  }
  
  handleMessage(ev: MessageEvent) {
    this.handleData(JSON.parse(ev.data));
  }

  protected handleData(data: any) {
    // receive data from server
    if (!('type' in data)) {
      addLogMessage('message without type: ' + JSON.stringify(data));
      return
    }
    const type = data.type;
    delete data.type;
    switch (type) {
      case LOG_MESSAGE:
        addLogMessage(data.message, data.level);
        break;
      case TELEMETRY_MESSAGE:
        this.handleTelemetry(data);
        break;
      case ACTION_MESSAGE:
        this.handleActionTask(data);
        break;
    }
  }

  private handleActionTask(data: any) {
    const system_name: string = data['sys'];
    if (!ui_state.rrc[system_name]) {
      ui_state.rrc[system_name] = {
        action_values: {},
        sensor_values: {},
        sensor_value: {}
      }
    }
    for (let id in data) {
      // ignore system name and timestamp
      if (id == 'sys' || id == 'type') {
        continue;
      }
      ui_state.rrc[system_name].action_values[id] = data[id];
    }
  }

  private handleTelemetry(data: any) {
    const system_name: string = data['sys'];
    if (!ui_state.rrc[system_name]) {
      ui_state.rrc[system_name] = {
        action_values: {},
        sensor_values: {},
        sensor_value: {}
      }
    }

    let ts: Date = new Date();
    let td: number = 0;
    if ('ts' in data) {
      ts = new Date(data.ts)
      td = Math.abs(new Date().getTime() - ts.getTime());
    }
    if ('td' in data) {
      td += Math.abs(data.td);
      ui_state.rrc[system_name].sensor_value.td = data.td;
    }
    for (let id in data) {
      // ignore system name and timestamp
      if (id == 'sys' || id == 'ts' || id == 'td' || id == 'type') {
        continue;
      }
      ui_state.rrc[system_name].sensor_value[id] = data[id];
      if (!(ui_state.rrc[system_name].sensor_values[id])) {
        ui_state.rrc[system_name].sensor_values[id] = [];
      }
      ui_state.rrc[system_name].sensor_values[id] = [[data[id], new Date()]];
    }
  }
}
