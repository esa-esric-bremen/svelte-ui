<script lang="ts">
	import type IConfig from "$lib/interfaces/IConfig";
	import { toggleTask, ui_state } from "$lib/state/ui.svelte";
	import LayoutGrid, { Cell } from "@smui/layout-grid";
	import { Button } from "smui-gamepad-components";

  interface Props {
    config: IConfig
  }

  let {
    config
  }: Props = $props();
</script>
{#if ui_state.rrc[config.system_name]}
<LayoutGrid>
  <Cell span={12}>
  {#each config.tasks as task}
  <div style:padding-right={"5px;"} style:display="inline">
    <Button
      variant={ui_state.rrc[config.system_name].action_values["task_" + task.name] == 1 ? 'raised' : 'outlined'}
      onpressed={()=>{ toggleTask(config.system_name, task.name); }}
      inputMapping={{
        name: task.name,
        gamepad: -1,
        buttons: task.buttons ? task.buttons : [],
        keys: task.keys ? task.keys : [],
      }}
    >{task.name}</Button>
    </div>
  {/each}
  </Cell>
</LayoutGrid>
{/if}