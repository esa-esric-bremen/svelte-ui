import type { IGraphSettings } from "./IGraphConfig"

export default interface ISensor {
  id: string
  name: string
  pos: number
  driver: 'cpu_temp' | 'vcgencmd' | 'board'
  frequency: number
  min_okay?: number
  max_okay?: number 
  show_diff?: boolean
  unit?: string
  scale?: number
  fixed?: number
  graph?: IGraphSettings
}
