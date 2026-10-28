export default interface IRobotRemoteControl {
  action_values: { [command: string]: number };
  // sensor history
  sensor_values: {
    [name: string]: [measurement: number, time: Date][];
  };
  // current sensor values
  sensor_value: {
    [name: string]: number;
  };
}
