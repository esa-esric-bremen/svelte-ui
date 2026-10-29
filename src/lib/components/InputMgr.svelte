<script lang="ts">
  import { onMount } from "svelte";

  import { hintMapping } from "#lib/global_mappings.svelte.js";
  import { addLogMessage } from "#lib/state/ui.svelte.js";
  import { component_state, InputManager, VirtualButton } from "svelte-gamepad-virtual-joystick";

  let {
    numGamepads = $bindable(0),
    mgr = $bindable()
  }: {numGamepads?: number,
    mgr?: InputManager
  } = $props();

  // getGamepads() has empty slots, only count connected gamepads
  const countGamepads = () => navigator.getGamepads().filter(Boolean).length;

  onMount(() => {
    numGamepads = countGamepads();
  })
</script>
<InputManager
  bind:this={mgr} 
  updateUsingAnimationFrame={true} 
  updateUsingInterval={false}
/>
<VirtualButton
  context={['default']}
  onpressed={() => {
    // show all hints
    component_state.showHints = !component_state.showHints;
  }}
  inputMapping={hintMapping}
></VirtualButton>

<svelte:window
  ongamepadconnected={(event) => {
    numGamepads = countGamepads();
    addLogMessage(`gamepad connected: ${event.gamepad.id}`, 'info');
  }}
  ongamepaddisconnected={(event) => {
    numGamepads = countGamepads();
    addLogMessage(`gamepad disconnected: ${event.gamepad.id}`, 'warning');
  }} />
