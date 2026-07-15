<script lang="ts">
	import { browser } from "$app/environment";
	import WebsocketData from "$lib/com/WebsocketData";
	import type IConfig from "$lib/interfaces/IConfig";
	import type ISensor from "$lib/interfaces/ISensor";
	import { ui_state } from "$lib/state/ui.svelte";
	import { onMount } from "svelte";
	import vcgencmd from "$lib/vcgencmd_parser";
	import type { IGraphConfig } from "$lib/interfaces/IGraphConfig";
	import LayoutGrid, { Cell } from "@smui/layout-grid";
	import Paper from "@smui/paper";

  interface Props {
    config: IConfig
  }

  let {
    config
  }: Props = $props();

  let graphs: IGraphConfig[] = $state([]);

  function errorClass(min_okay: number, max_okay: number, value: number) {
    if (max_okay && value > max_okay) {
      return 'red_alert';
    }
    if (min_okay && value < min_okay) {
      return 'red_alert';
    }
    return '';
  }

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

  function getValue(sensor: ISensor, value: number) {
    if (!value) {
      value = 0;
    }
    if (sensor.driver == 'vcgencmd') {
      return vcgencmd(value);
    }
    let val = value.toString();
    if (sensor.fixed && value !== undefined) {
      val = value.toFixed(sensor.fixed);
    }
    return `${val} ${sensor.unit}`
  }

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
          system_name: config.system_name || '',
          dims: sensor.graph.dims
        });
      });
    }
  });
</script>

{#if ui_state.rrc[config.system_name]}
<LayoutGrid>
  {#each config.sensors as sensor}
    <Cell span={2}>
      
      <Paper variant="outlined" style="border-color: {borderColor(sensor)}"
      class={errorClass(sensor.min_okay, sensor.max_okay, ui_state.rrc[config.system_name].sensor_value[sensor.id])}>
        <div style:width="100%;">
          {sensor.name}<br />
          {
            getValue(
              sensor,
              ui_state.rrc[config.system_name].sensor_value[sensor.id])
          }
        </div>
      </Paper>
    </Cell>
    {#if sensor.show_diff}
    <Cell span={2}>
      <Paper variant="outlined" style="border-color: {borderColor(sensor)}">
        <div style:width="100%;">
          {sensor.name} diff.<br />
          {
            getLastDiff(
              sensor,
              ui_state.rrc[config.system_name].sensor_values[sensor.id])
            
          }
        </div>
      </Paper>
    </Cell>
    {/if}
  {/each}

  <!-- special "sensor" showing communication delay -->
  {#if ui_state.rrc[config.system_name].sensor_value.td}
    <Cell span={2}>
      <Paper variant="outlined" color="primary">
        <div style:width="100%;">
          Com time.<br />
          {
            ui_state.rrc[config.system_name].sensor_value.td.toFixed(2)
          } s
        </div>
      </Paper>
    </Cell>
  {/if}

  <Cell span={12}></Cell>

  <!-- {#each graphs as graph}
    <Cell span={4}>
      {graph.id}
      <Graph config={graph}></Graph>
    </Cell>
  {/each} -->
</LayoutGrid>
{/if}
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