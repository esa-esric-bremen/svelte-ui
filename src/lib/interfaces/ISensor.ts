import type { IGraphSettings } from "./IGraphConfig"

export default interface ISensor {
  id: string
  name: string
  pos: number
  driver: 'hx711' | 'gpio' | 'ina228' | 'ads1x15' | 'cpu_temp' | 'vcgencmd' | 'olimexino'
  frequency: number
  min_okay?: number
  max_okay?: number 
  show_diff?: boolean
  unit?: string
  scale?: number
  fixed?: number
  graph?: IGraphSettings
}
