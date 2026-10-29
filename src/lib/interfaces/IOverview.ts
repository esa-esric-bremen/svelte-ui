// Sensors the overview screen uses (overview: in a robot config)
export default interface IOverview {
  // container scale (g): only increases count as excavated material
  weight_sensor?: string
  // changes smaller than this are measurement noise, not material (g)
  weight_noise_g?: number
  // energy = integral of voltage * current
  voltage_sensor?: string
  current_sensor?: string
}
