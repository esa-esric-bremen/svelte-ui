<script lang="ts">
  import { onMount } from "svelte";

  import { hintMapping } from "$lib/global_mappings.svelte";
  import { component_state, InputManager, VirtualButton } from "svelte-gamepad-virtual-joystick";

  let {
    numGamepads = $bindable(0),
    mgr = $bindable()
  }: {numGamepads?: number,
    mgr: InputManager
  } = $props();

  onMount(() => {
    numGamepads = navigator.getGamepads().length;
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
  ongamepadconnected={() => {
    numGamepads = navigator.getGamepads().length
  }} 
  ongamepaddisconnected={() => {
    numGamepads = navigator.getGamepads().length
  }} />