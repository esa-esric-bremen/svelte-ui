export default interface ILogMessage {
  timestamp: Date;
  level: 'error' | 'warning' | 'info',
  message: string
}