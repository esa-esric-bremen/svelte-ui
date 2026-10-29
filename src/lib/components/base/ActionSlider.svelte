<script lang="ts">
  import type IAction from '#lib/interfaces/IAction.js';
  import type IConfig from '#lib/interfaces/IConfig.js';
  import { ui_state } from '#lib/state/ui.svelte.js';
  import { rrc } from '#lib/rrc/clients.js';
  import { emergencyMapping } from '#lib/global_mappings.svelte.js';
  import StepSlider from '#lib/StepSlider.svelte';
  import { Button, IconButton } from 'noph-gamepad-components';
  import { GamepadButtons, type ButtonInput } from 'svelte-gamepad-virtual-joystick';

  let {
    action,
    fullRange,
    config,
    readonly
  }: {
    action: IAction;
    fullRange: boolean;
    config: IConfig;
    readonly: boolean;
  } = $props();

  const actualValue = $derived(ui_state.rrc[config.system_name].action_values[action.command]);
  const step = action.step || 10;
  const min = $derived(action.ui_range && !fullRange ? action.ui_range[0] : (action.range?.[0] ?? 0));
  const max = $derived(action.ui_range && !fullRange ? action.ui_range[1] : (action.range?.[1] ?? 100));

  let value = $state(
    ui_state.rrc[config.system_name].action_values[action.command] ?? action.start ?? 0
  );

  function skipDeadzones(newValue: number, difference: number): number {
    for (const [low, high] of action.deadzones ?? []) {
      if (newValue >= low && newValue <= high) {
        newValue = difference < 0 ? low - step : high + step;
      }
    }
    return newValue;
  }

  // step relative to what the robot actually runs, not to the last requested value
  function stepFromActual(difference: number) {
    let newValue = Math.round(((actualValue ?? value) + difference) / step) * step;
    newValue = Math.max(Math.min(newValue, max), min);
    value = skipDeadzones(newValue, difference);
  }

  function stop() {
    if (readonly) return;
    if (action.value_stop) {
      value = action.start ?? 0;
    } else {
      rrc(config.system_name).setSimpleAction(`stop_${action.command}`, action.start ?? 0);
    }
  }

  const leftMapping: ButtonInput = {
    name: action.name + '_left',
    gamepad: -1,
    buttons: action.buttons_neg ?? [GamepadButtons.L1],
    keys: action.keys_neg ?? ['d']
  };
  const rightMapping: ButtonInput = {
    name: action.name + '_right',
    gamepad: -1,
    buttons: action.buttons_pos ?? [GamepadButtons.R1],
    keys: action.keys_pos ?? ['a']
  };
  const stopMapping: ButtonInput = { ...emergencyMapping, name: 'reset to start' };

  $effect(() => {
    if (readonly) return;
    if (isNaN(value)) {
      value = actualValue ?? action.start ?? 0;
      return;
    }
    const clamped = Math.max(Math.min(value, max), min);
    if (clamped != value) {
      value = clamped;
      return;
    }
    rrc(config.system_name).setSimpleAction(action.command, value);
  });

  const icon = action.icon ?? action.command;
</script>

<div class="action-row">
  <div class="name">
    {action.name}
    <b class="mobile">{value}</b>
  </div>
  <Button
      class="step-button"
      variant="outlined"
      disabled={readonly}
      onclick={() => stepFromActual(-step)}
      inputMapping={leftMapping}>
    <img alt="decrease" src="/{icon}_left.png" />
  </Button>
  <div class="no_mobile">
    <StepSlider
      bind:value
      {min} {max} {step}
      {actualValue}
      start={action.start ?? 0}
      disabled={readonly} />
  </div>
  <Button
      class="step-button"
      variant="outlined"
      disabled={readonly}
      onclick={() => stepFromActual(step)}
      inputMapping={rightMapping}>
    <img alt="increase" src="/{icon}_right.png" />
  </Button>
  <b class="value no_mobile">{value}</b>
  <IconButton size="l" variant="outlined" disabled={readonly} inputMapping={stopMapping} onclick={stop}>
    <span class="material-icons">stop</span>
  </IconButton>
</div>

<style>
  .action-row {
    display: grid;
    grid-template-columns: 2fr auto 6fr auto 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 6px 0;
  }

  @media (max-width: 840px) {
    .action-row {
      grid-template-columns: 2fr auto auto auto;
    }
  }

  .value {
    font-size: 20pt;
    text-align: center;
  }

  .name b {
    display: block;
    font-size: 20pt;
  }

  .action-row :global(.np-button.step-button) {
    width: 120px;
    height: 80px;
    --np-button-padding: 0;
  }

  .action-row :global(.step-button .children-wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    display: block;
    height: 64px;
  }
</style>
