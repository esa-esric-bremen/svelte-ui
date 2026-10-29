<script lang="ts">
  import type IConfig from '#lib/interfaces/IConfig.js';
  import type ISensor from '#lib/interfaces/ISensor.js';
  import { isLive, ui_state } from '#lib/state/ui.svelte.js';
  import Graph from './graph/Graph.svelte';
  import { rrc } from '#lib/rrc/clients.js';
  import vcgencmd from '#lib/vcgencmd_parser.js';
  import { onMount } from 'svelte';

  let { config }: { config: IConfig } = $props();

  const state = $derived(ui_state.rrc[config.system_name]);
  const live = $derived(isLive(config.system_name));
  const graphs = $derived((config.sensors ?? []).filter((sensor) => sensor.graph));

  onMount(() => {
    rrc(config.system_name);
  });

  function isAlert(sensor: ISensor, value: number) {
    return (
      (sensor.max_okay !== undefined && value > sensor.max_okay) ||
      (sensor.min_okay !== undefined && value < sensor.min_okay)
    );
  }

  function format(sensor: ISensor, value: number) {
    const val = sensor.fixed ? value.toFixed(sensor.fixed) : value.toString();
    return `${val} ${sensor.unit ?? ''}`;
  }

  function display(sensor: ISensor, value = 0) {
    return sensor.driver == 'vcgencmd' ? vcgencmd(value) : format(sensor, value);
  }

  function lastDiff(sensor: ISensor, values: [number, Date][] = []) {
    const diff = values.length > 1 ? values[values.length - 2][0] - values[values.length - 1][0] : 0;
    return format(sensor, diff);
  }

  const borderColor = (sensor: ISensor) => sensor.graph?.color ?? 'var(--np-color-primary)';
</script>

{#if state}
  {#if !live}
    <div class="stale-banner" role="alert">No current data from {config.name}, values are outdated</div>
  {/if}
  <div class="sensors" class:stale={!live}>
    {#each config.sensors ?? [] as sensor (sensor.id)}
      <div
        class="tile"
        class:red_alert={isAlert(sensor, state.sensor_value[sensor.id])}
        style:border-color={borderColor(sensor)}
      >
        {sensor.name}<br />
        {display(sensor, state.sensor_value[sensor.id])}
      </div>
      {#if sensor.show_diff}
        <div class="tile" style:border-color={borderColor(sensor)}>
          {sensor.name} diff.<br />
          {lastDiff(sensor, state.sensor_values[sensor.id])}
        </div>
      {/if}
    {/each}

    <!-- communication delay, added by controller-web -->
    {#if state.sensor_value.td}
      <div class="tile">
        Com time.<br />
        {state.sensor_value.td.toFixed(2)} s
      </div>
    {/if}
  </div>

  {#if graphs.length}
    <div class="graphs" class:stale={!live}>
      {#each graphs as sensor (sensor.id)}
        <Graph
          config={{ ...sensor.graph!, system_name: config.system_name }}
          title={sensor.name}
          unit={sensor.unit}
        />
      {/each}
    </div>
  {/if}
{/if}

<style>
  .stale-banner {
    margin-top: 16px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: var(--np-color-error-container);
    color: var(--np-color-on-error-container);
    font-weight: 500;
  }

  .stale .tile,
  .graphs.stale {
    opacity: 0.4;
  }

  .graphs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .sensors {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin: 16px 0;
  }
</style>
