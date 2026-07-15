import type IAction from "./IAction"
import type ISensor from "./ISensor"
import type ITask from "./ITask"
import type ITwist from "./ITwist"

export default interface IConfig {
  command_address_port: number
  telemetry_address_port: number
  ip_address: string
  name: string
  system_name: string
  visualizations?: string[]
  actions: IAction[]
  twist?: ITwist[]
  sensors?: ISensor[]
  tasks?: ITask[]
  reset: boolean
}