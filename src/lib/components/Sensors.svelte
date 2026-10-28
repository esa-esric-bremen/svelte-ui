<script lang="ts">
  import type IConfig from '#lib/interfaces/IConfig';
  import type ISensor from '#lib/interfaces/ISensor';
  import { ui_state } from '#lib/state/ui.svelte';
  import { rrc } from '#lib/rrc/clients';
  import vcgencmd from '#lib/vcgencmd_parser';
  import { onMount } from 'svelte';

  let { config }: { config: IConfig } = $props();

  const state = $derived(ui_state.rrc[config.system_name]);

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
  <div class="sensors">
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
{/if}

<style>
  .sensors {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin: 16px 0;
  }
</style>
