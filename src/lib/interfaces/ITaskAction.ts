export default interface ITaskAction {
    type: 'DURATION' | 'RUN' | 'SET_VALUE',
    command: string
    value: number
    duration_ms: number
}