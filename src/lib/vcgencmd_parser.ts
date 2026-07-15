const UNDERVOLTAGE_DETECTED = 0x1;
const ARM_FREQ_CAPPED = 0x2;
const CURRENTLY_THROTTLED = 0x4;
const SOFT_TEMPERATURE_LIMIT = 0x8;
const UNDERVOLTAGE_OCCURED = 0x10000;
const ARM_FREQ_CAPP_OCCURED = 0x20000
const THROTTLING_OCCURED = 0x40000;
const SOFT_TEMPERATURE_LIMIT_OCCURED = 0x80000;

export default (value: number) => {
  if (value == 0) {
    return 'okay';
  }
  let state = '';
  state += ((value & UNDERVOLTAGE_OCCURED) == UNDERVOLTAGE_OCCURED) ? '⚡' : '-'
  state += ((value & THROTTLING_OCCURED) == THROTTLING_OCCURED) ? '☹️' : '-'
  state += ((value & ARM_FREQ_CAPP_OCCURED) == ARM_FREQ_CAPP_OCCURED) ? '🐌' : '-'
  state += ((value & SOFT_TEMPERATURE_LIMIT_OCCURED) == SOFT_TEMPERATURE_LIMIT_OCCURED) ? '🌡️' : '-'
  state += '|'
  state += ((value & UNDERVOLTAGE_DETECTED) == UNDERVOLTAGE_DETECTED) ? '⚡' : '-'
  state += ((value & CURRENTLY_THROTTLED) == CURRENTLY_THROTTLED) ? '☹️' : '-'
  state += ((value & ARM_FREQ_CAPPED) == ARM_FREQ_CAPPED) ? '🐌' : '-'
  state += ((value & SOFT_TEMPERATURE_LIMIT) == SOFT_TEMPERATURE_LIMIT) ? '🌡️' : '-'
  return state;
}