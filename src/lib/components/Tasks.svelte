<script lang="ts">
  import type IConfig from '#lib/interfaces/IConfig.js';
  import { ui_state } from '#lib/state/ui.svelte.js';
  import { rrc } from '#lib/rrc/clients.js';
  import { Button } from 'noph-gamepad-components';

  let { config }: { config: IConfig } = $props();

  const isRunning = (name: string) => ui_state.rrc[config.system_name].action_values[`task_${name}`] == 1;

  const toggle = (name: string) =>
    rrc(config.system_name).setSimpleAction(`task_${name}`, isRunning(name) ? 0 : 1);
</script>

{#if ui_state.rrc[config.system_name]}
  <div class="toolbar">
    {#each config.tasks ?? [] as task (task.name)}
      <Button
        variant={isRunning(task.name) ? 'filled' : 'outlined'}
        onclick={() => toggle(task.name)}
        inputMapping={{
          name: task.name,
          gamepad: -1,
          buttons: (task.buttons ?? []).map(Number),
          keys: task.keys ?? []
        }}>{task.name}</Button
      >
    {/each}
  </div>
{/if}
