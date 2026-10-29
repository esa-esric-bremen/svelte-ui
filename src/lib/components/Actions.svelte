<script lang="ts">
  import type IAction from '#lib/interfaces/IAction.js';
  import type IConfig from '#lib/interfaces/IConfig.js';
  import { ui_state } from '#lib/state/ui.svelte.js';
  import { rrc } from '#lib/rrc/clients.js';
  import ActionSlider from './base/ActionSlider.svelte';
  import { Button } from 'noph-ui';
  import { onMount } from 'svelte';

  let {
    config,
    readonly,
    fullRange
  }: {
    config: IConfig;
    readonly: boolean;
    fullRange: boolean;
  } = $props();

  onMount(() => {
    // also opens the telemetry connection
    const client = rrc(config.system_name);
    if (readonly || config.reset === false) return;
    for (const action of config.actions) {
      client.setSimpleAction(`reset_${action.command}`, 0);
    }
  });

  const reinit = (action: IAction) => rrc(config.system_name).setSimpleAction(`reinit_${action.command}`, 1);
</script>

{#if config.actions && ui_state.rrc[config.system_name]}
  {#if !readonly}
    <div class="toolbar">
      {#each config.actions as action (action.command)}
        <Button variant="outlined" onclick={() => reinit(action)}>init {action.name}</Button>
      {/each}
    </div>
  {/if}
  {#each config.actions as action (action.command)}
    <ActionSlider {action} {config} {readonly} {fullRange} />
  {/each}
{/if}
