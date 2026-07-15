import WebsocketData from "$lib/com/WebsocketData";
import type IConfig from "$lib/interfaces/IConfig";
import type ILogMessage from "$lib/interfaces/ILogMessage";
import type IRobotRemoteControl from "$lib/interfaces/IRobotRemoteControl";

export const ui_state = $state<{
  rpiConfigs: {[name: string]: IConfig}
  rrc: {[name: string]: IRobotRemoteControl},
  log: ILogMessage[]
  websocket?: WebsocketData
  tasks: {[name: string]: number}
}>({
  rpiConfigs: {},
  rrc: {},
  log: [],
  websocket: undefined,
  tasks: {}
});



export function addLogMessage(message: string, level: ILogMessage['level'] = 'error') {
    // With Svelte 5, simply pushing to the array is enough to trigger reactivity.
    const new_log = [{ message, level, timestamp: new Date() }, ...ui_state.log]
    ui_state.log = new_log;
}

export function toggleTask(system_name: string, task_name: string) {
  if (!ui_state.websocket) {
    return;
  }
  let value = 1;
  if (ui_state.rrc[system_name].action_values["task_" + task_name]) {
    value = ui_state.rrc[system_name].action_values["task_" + task_name] == 0 ? 1 : 0;
  }
  ui_state.websocket.send(JSON.stringify({
    cmd: `task_${task_name}`,
    sys: system_name,
    value}));
}