import type ITaskAction from "./ITaskAction"

export default interface IStep {
    id: number
    condition: {
        type: 'IMMEDIATE' | 'TIME_ELAPSED_FROM_START' | 'SENSOR_VALUE'
        duration_ms: number
        sensor_id: string
        op: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS',
        value: number
    }
    actions: ITaskAction[]
}