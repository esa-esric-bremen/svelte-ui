import type ILogMessage from '#lib/interfaces/ILogMessage.js';
import type IRobotRemoteControl from '#lib/interfaces/IRobotRemoteControl.js';

export type LinkState = 'unknown' | 'up' | 'down';

export interface Connection {
  // browser <-> controller-web
  relay: LinkState;
  // controller-web <-> robot, judged by robot data arriving
  robot: LinkState;
}

export const ui_state = $state<{
  rrc: { [system_name: string]: IRobotRemoteControl };
  connection: { [system_name: string]: Connection };
  log: ILogMessage[];
}>({
  rrc: {},
  connection: {},
  log: []
});

export function addLogMessage(message: string, level: ILogMessage['level'] = 'error') {
  ui_state.log = [{ message, level, timestamp: new Date() }, ...ui_state.log];
}

// robot data is current: the relay is reachable and the robot sends
export function isLive(system_name: string): boolean {
  const connection = ui_state.connection[system_name];
  return connection?.relay === 'up' && connection.robot === 'up';
}
