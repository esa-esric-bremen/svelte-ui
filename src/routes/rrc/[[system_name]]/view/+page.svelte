<script lang="ts">
  import { onMount } from "svelte";
  import WebsocketData from "$lib/com/WebsocketData";
  import { addLogMessage, toggleTask, ui_state } from "$lib/state/ui.svelte";

  import yaml from 'js-yaml';

  import { GamepadButtons, Icon as GamepadIcon } from 'svelte-gamepad-virtual-joystick';

  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import Paper, {Content} from "@smui/paper";
  import Graph from "$lib/components/graph/Graph.svelte";
  import type { IGraphConfig } from "$lib/interfaces/IGraphConfig";
  import ScrollableLog from "$lib/components/log/ScrollableLog.svelte";

  import Nav from "$lib/components/nav/Nav.svelte"
  import ActionSlider from "$lib/components/base/ActionSlider.svelte";
  import { hintMapping } from "$lib/global_mappings.svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";

  import config_rpi_robot from '$lib/data/config_rpi_robot.yaml?raw';
//  import config_beneficiation from '$lib/data/config_beneficiation.yaml?raw';
  import config_coyote from '$lib/data/config_coyote.yaml?raw';
	import type IConfig from "$lib/interfaces/IConfig";
	import type ISensor from "$lib/interfaces/ISensor";
	import { Button } from "smui-gamepad-components";
	import System from "$lib/components/System.svelte";

  const configs = {
//    beneficiation: yaml.load(config_beneficiation) as IConfig,
    rpi_robot: yaml.load(config_rpi_robot) as IConfig,
    coyote: yaml.load(config_coyote) as IConfig
  }

  const system_name: 'rpi_robot' | 'coyote' | undefined = page.params?.system_name
  const config: IConfig = (system_name) ? configs[system_name] : configs['rpi_robot'];

  let graphs: IGraphConfig[] = $state([]);

  onMount(() => {
    if (!browser) {
      return
    }
    if (!ui_state.websocket) {
      ui_state.websocket = new WebsocketData();
      ui_state.websocket.connect();
    }
    graphs = [];
    if (config.sensors) {
      config.sensors.forEach((sensor) => {
        if (!sensor.graph) {
          return;
        }
        graphs.push({
          color: sensor.graph.color,
          id: sensor.graph.id,
          system_name: system_name || '',
          dims: sensor.graph.dims
        })
      });
    }
  });

  const UNDERVOLTAGE_DETECTED = 0x1;
  const ARM_FREQ_CAPPED = 0x2;
  const CURRENTLY_THROTTLED = 0x4;
  const SOFT_TEMPERATURE_LIMIT = 0x8;
  const UNDERVOLTAGE_OCCURED = 0x10000;
  const ARM_FREQ_CAPP_OCCURED = 0x20000
  const THROTTLING_OCCURED = 0x40000;
  const SOFT_TEMPERATURE_LIMIT_OCCURED = 0x80000;

  function getLastDiff(sensor:ISensor, values: [value: number, time: Date][]): string {
    const value = (values && values.length > 1) ? values[values.length-2][0] - values[values.length-1][0] : 0;
    let val = value.toString();
    if (sensor.fixed && value !== undefined) {
      val = value.toFixed(sensor.fixed);
    }
    return `${val} ${sensor.unit}`
  }

  function borderColor(sensor: ISensor) {
    return (sensor.graph && sensor.graph.color) ? sensor.graph.color : "var(--mdc-theme-primary, #4093ca)";
  }

  function errorClass(min_okay: number, max_okay: number, value: value) {
    if (max_okay && value > max_okay) {
      return 'red_alert';
    }
    if (min_okay && value < min_okay) {
      return 'red_alert';
    }
    return '';
  }

  function getValue(sensor: ISensor, value: number) {
    if (!value) {
      value = 0;
    }
    if (sensor.driver == 'vcgencmd') {
      if (value == 0) {
        return 'okay';
      }
      let state = '';
      console.log(value);
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
    let val = value.toString();
    if (sensor.fixed && value !== undefined) {
      val = value.toFixed(sensor.fixed);
    }
    return `${val} ${sensor.unit}`
  }
</script>

<Nav>
  <div class="center_main">
    <Paper>
      <Content>
        <System readonly={true} {config} />
        <ScrollableLog></ScrollableLog>
      </Content>
    </Paper>
  </div>
</Nav>

<style>
  .red_alert {
    background-color: #ff0000;
    animation-name: red_alert_animation;
    animation-duration: 1s;
    animation-iteration-count:infinite;
  }

  @keyframes red_alert_animation {
    0%   {background-color: #ff6666;}
    50% {background-color: #ff0000;}
    100%   {background-color: #ff6666;}
  }
</style>
