
import yaml from 'js-yaml';

import config_rpi_robot from '$lib/data/config_rpi_robot.yaml?raw';
//import config_beneficiation from '$lib/data/config_beneficiation.yaml?raw';
import config_coyote from '$lib/data/config_coyote.yaml?raw';
import type IConfig from './interfaces/IConfig';

export default {
//  beneficiation: yaml.load(config_beneficiation) as IConfig,
  rpi_robot: yaml.load(config_rpi_robot) as IConfig,
  coyote: yaml.load(config_coyote) as IConfig
}