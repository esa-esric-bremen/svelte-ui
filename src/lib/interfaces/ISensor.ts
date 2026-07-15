import type { IGraphConfig } from "./IGraphConfig"

export default interface ISensor {
  id: string
  name: string
  pos: number
  driver: 'hx711' | 'gpio' | 'ina228' | 'cpu_temp' | 'vcgencmd'
  frequency: number
  max_okay?: number 
  show_diff?: boolean
  unit?: string
  scale?: number
  fixed?: number
  graph?: IGraphConfig
}