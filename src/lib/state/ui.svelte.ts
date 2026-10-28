import type ILogMessage from '#lib/interfaces/ILogMessage';
import type IRobotRemoteControl from '#lib/interfaces/IRobotRemoteControl';

export const ui_state = $state<{
  rrc: { [system_name: string]: IRobotRemoteControl };
  log: ILogMessage[];
}>({
  rrc: {},
  log: []
});

export function addLogMessage(message: string, level: ILogMessage['level'] = 'error') {
  ui_state.log = [{ message, level, timestamp: new Date() }, ...ui_state.log];
}
