<script lang="ts">
  import type IConfig from "#lib/interfaces/IConfig";
  import { ui_state } from "#lib/state/ui.svelte";
  import Actions from "./Actions.svelte";
  import Twist from "./robot/Twist.svelte";
  import Sensors from "./Sensors.svelte";
  import Tasks from "./Tasks.svelte";

  interface Props {
    config: IConfig
    fullRange?: boolean
    readonly?: boolean
  }

  let {
    config,
    fullRange = true,
    readonly = false
  }: Props = $props();
</script>


<h3>{config.name}</h3>

{#if config.twist && !readonly}
  <Twist system_name={config.system_name} />
{/if}
<Actions {config} {fullRange} {readonly} />
<!--Tasks {config} {readonly} /-->
<Sensors {config} />