export default interface IAction {
  name: string,
  command: string,
  icon?: string,
  driver: 'gpio' | 'motor',
  mode?: 'pwm' | 'gpio',
  pin?: number,
  range?: [begin: number, end: number],
  ui_range?: [begin: number, end: number],
  start?: number
  step?: number
  keys_pos?: [key: string]
  keys_neg?: [key: string]
  buttons_pos?: [btn: number]
  buttons_neg?: [btn: number]
  value_stop?: boolean
  counter?: string
  deadzones?: [low: number, high: number][]
}
