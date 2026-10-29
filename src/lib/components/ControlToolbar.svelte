<script lang="ts">
  import { Button as GamepadButton } from 'noph-gamepad-components';
  import { Button } from 'noph-ui';
  import { component_state } from 'svelte-gamepad-virtual-joystick';

  let { fullRange = $bindable(false) }: { fullRange?: boolean } = $props();
</script>

<div class="toolbar">
  <GamepadButton
    variant={fullRange ? 'filled' : 'outlined'}
    onclick={() => (fullRange = !fullRange)}
    inputMapping={{ name: 'toggle_button_range', gamepad: -1, buttons: [], keys: [] }}
    >full range</GamepadButton
  >
  <Button
    variant={component_state.showHints ? 'filled' : 'outlined'}
    onclick={() => (component_state.showHints = !component_state.showHints)}>Show hints</Button
  >
</div>
