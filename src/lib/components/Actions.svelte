
<script lang="ts">
	import type IConfig from "$lib/interfaces/IConfig";
	import LayoutGrid, { Cell } from "@smui/layout-grid";
	import ActionSlider from "./base/ActionSlider.svelte";
	import { ui_state } from "$lib/state/ui.svelte";
	import Paper from "@smui/paper";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import WebsocketData from "$lib/com/WebsocketData";
	import Button from "@smui/button";
	import type IAction from "$lib/interfaces/IAction";

  interface Props {
    config: IConfig
    readonly: boolean
    fullRange: boolean
  }

  let {
    config,
    readonly,
    fullRange
  }: Props = $props();

  function counterStyle(c: number, actionValue: number) {
    const def = "text-align: center;";
    if (actionValue > (c-1) && actionValue < (c)) {
      return `${def} background-color: yellow; color: black`;
    } else if (c <= actionValue) {
      return `${def} background-color: lightblue; color: black`;
    }
    return def;
  }

  onMount(() => {
    if (!browser) {
      return
    }
    if (!ui_state.websocket) {
      ui_state.websocket = new WebsocketData();
      ui_state.websocket.connect();
    }
    if (readonly) {
      return;
    }
    config.actions.forEach((action) => {
      if (!ui_state.websocket) {
        return;
      }
      if (config.reset === undefined || config.reset == true) {
        ui_state.websocket.send(JSON.stringify({
          cmd: `reset_${action.command}`,
          sys: config.system_name,
          value: 0
        }));
      }
    });
  });

  const reinit = (action: IAction) => {
    if (!ui_state.websocket) {
      ui_state.websocket = new WebsocketData();
      ui_state.websocket.connect();
    }
    ui_state.websocket.send(JSON.stringify({
      cmd: `reinit_${action.command}`,
      sys: config.system_name,
      value: 1
    }));
  }
</script>

{#if config.actions && ui_state.rrc[config.system_name]}
  {#each config.actions as action}
  <Button variant="outlined" onclick={() => reinit(action)}>init {action.name}</Button><br />
  {/each}
  <LayoutGrid>
  {#each config.actions as action}
    <ActionSlider {action} {config} {readonly} {fullRange}></ActionSlider>
    <!--
    {#if action.counter}
    <Cell span={3} class="no_mobile"></Cell>
    {#each [1, 2, 3, 4, 5, 6] as c}
    <Cell span={1} class="no_mobile">
      <Paper variant="outlined" color="secondary" style={counterStyle(c, 
        action.counter in ui_state.rrc[config.system_name].action_values ? ui_state.rrc[config.system_name].action_values[action.counter] : 0)}>{c}</Paper>
    </Cell>
    {/each}
    <Cell span={3} class="no_mobile"></Cell>
    {/if}
    -->
  {/each}
  </LayoutGrid>
{/if}

<style>
@media (max-width: 840px) {
  :global(.no_mobile) {
    display: none !important;
  }
}
</style>