<script lang="ts">
  import Nav from '#lib/components/nav/Nav.svelte';
  import Graph from '#lib/components/graph/Graph.svelte';
  import configs from '#lib/configs.js';
  import { isLive, ui_state, type LinkState } from '#lib/state/ui.svelte.js';
  import { resetTotals, totals } from '#lib/state/totals.svelte.js';
  import { Button } from 'noph-ui';

  const systems = Object.values(configs);
  // the system(s) with a container scale
  const weighing = systems.filter((c) => c.overview?.weight_sensor);

  const linkText: Record<LinkState, string> = {
    up: 'connected',
    down: 'not connected',
    unknown: 'connecting …'
  };

  function weightNow(system_name: string, sensor: string): string {
    const value = ui_state.rrc[system_name]?.sensor_value[sensor];
    return value === undefined || !isLive(system_name) ? '–' : `${Math.round(value)} g`;
  }

  function reset() {
    if (confirm('Reset the excavated weight and energy to zero?')) {
      resetTotals();
    }
  }
</script>

<Nav>
  <section class="center_main surface">
    <h3>Systems</h3>
    <div class="card-grid">
      {#each systems as config (config.system_name)}
        {@const connection = ui_state.connection[config.system_name]}
        <div class="tile system" class:live={isLive(config.system_name)}>
          <h4>{config.name}</h4>
          <div class="link {connection?.relay ?? 'unknown'}">Relay: {linkText[connection?.relay ?? 'unknown']}</div>
          <div class="link {connection?.relay === 'up' ? connection.robot : 'unknown'}">
            Robot: {connection?.relay === 'up' ? linkText[connection.robot] : '–'}
          </div>
        </div>
      {/each}
    </div>

    <h3>Excavation</h3>
    <div class="card-grid">
      <div class="tile number">
        <span class="caption">Excavated total</span>
        <span class="value">{(totals.excavated_g / 1000).toFixed(2)} kg</span>
      </div>
      {#each weighing as config (config.system_name)}
        <div class="tile number">
          <span class="caption">In the container</span>
          <span class="value">{weightNow(config.system_name, config.overview!.weight_sensor!)}</span>
        </div>
      {/each}
      <div class="tile number">
        <span class="caption">Energy used</span>
        <span class="value">{totals.energy_wh.toFixed(2)} Wh</span>
      </div>
      <div class="tile number">
        <span class="caption">Counting since</span>
        <span class="since">{new Date(totals.since).toLocaleString()}</span>
        <Button variant="outlined" onclick={reset}>Reset</Button>
      </div>
    </div>

    {#each weighing as config (config.system_name)}
      {@const sensor = config.sensors?.find((s) => s.id === config.overview!.weight_sensor)}
      {#if sensor?.graph}
        <div class="graph">
          <Graph config={{ ...sensor.graph, system_name: config.system_name }} title="Container weight" unit={sensor.unit} />
        </div>
      {/if}
    {/each}
  </section>
</Nav>

<style>
  h4 {
    margin: 0 0 8px;
  }

  .link::before {
    content: '●';
    margin-right: 6px;
  }

  .link.up::before {
    color: var(--np-color-primary);
  }

  .link.down::before {
    color: var(--np-color-error);
  }

  .link.unknown::before {
    color: var(--np-color-outline);
  }

  .system.live {
    border-color: var(--np-color-primary);
  }

  .number {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .caption {
    color: var(--np-color-on-surface-variant);
  }

  .value {
    font-size: 2rem;
    font-weight: 500;
  }

  .since {
    margin-bottom: 4px;
  }

  .graph {
    margin-top: 16px;
  }
</style>
