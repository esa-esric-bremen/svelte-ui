<script lang="ts">
  import Snackbar, { Label as SnackbarLabel } from  '@smui/snackbar';
  import { hintMapping } from "$lib/global_mappings.svelte";
  import { Icon as GamepadIcon } from 'svelte-gamepad-virtual-joystick';
	import { onMount } from 'svelte';

  let hintInfo: Snackbar;

  onMount(() => {
    hintInfo.open();
  })
</script>

<Snackbar bind:this={hintInfo}>
  <SnackbarLabel>
    <GamepadIcon 
      type="keyboard_mouse" 
      input={hintMapping.keys[0]}></GamepadIcon>
    or 
    <GamepadIcon
      type="ps4"
      input={hintMapping.buttons[0]}></GamepadIcon>
    toggle help.
  </SnackbarLabel>
</Snackbar>