<script lang="ts">
  import { Icon } from '@smui/button';
	import type IAction from '$lib/interfaces/IAction';
	import { ui_state } from '$lib/state/ui.svelte';
  import { Cell } from '@smui/layout-grid';
  import Paper, {Content} from "@smui/paper";
	import { IconButton } from 'smui-gamepad-components';
	import { GamepadButtons, type ButtonInput, Button } from 'svelte-gamepad-virtual-joystick';
	import StepSlider from '$lib/StepSlider.svelte';
	import { emergencyMapping } from '$lib/global_mappings.svelte';
	import type IConfig from '$lib/interfaces/IConfig';

  // TODO: inherit from ActionCommand
  const {
    action,
    fullRange,
    config,
    readonly
  } = $props<{
    action: IAction,
    fullRange: boolean,
    config: IConfig,
    readonly: boolean
  }>();

  let value = $state(ui_state.rrc[config.system_name].action_values[action.command] ?? action.start ?? 0);

  function checkDeadzones(newValue: number, difference: number): number {
    if (!action.deadzones) {
      return newValue;
    }
    for (const deadzone of action.deadzones) {
      if (newValue >= deadzone[0] && newValue <= deadzone[1]) {
        newValue = difference < 0 ? deadzone[0] - action.step : deadzone[1] + action.step;
       }
    }
    return newValue;
  }

  function updateFromActualValue(difference: number): number {
    let newValue = ui_state.rrc[config.system_name].action_values[action.command] + difference;
    newValue = Math.round(newValue / action.step) * action.step;
    newValue = Math.max(Math.min(newValue, getMax()), getMin());
    if (action.deadzones) {
       if (action.deadzones[0] && newValue > action.deadzones[0][0] && newValue < action.deadzones[0][1]) {
        newValue = difference < 0 ? action.deadzones[0][0] - action.step : action.deadzones[0][1] + action.step
       }
    }
    return checkDeadzones(newValue, difference);
  }

  // const inputMapping = {
  //   name: action.name,
  //   gamepad: -1,
  //   sensitivity: 0.05,
  //   axes: 0,
  //   buttons: [GamepadButtons.RIGHT], // activate/focus next component
  //   buttons_neg: action.buttons_neg || [GamepadButtons.L1],
  //   buttons_pos: action.buttons_pos || [GamepadButtons.R1],
  //   keys_pos: [],
  //   keys_neg: [],
  //   keys: ['e', 'enter'],  // activate/focus next component
  //   invert: false
  // }

  const inputMappingLeft: ButtonInput = {
    name: action.name + "_left",
    gamepad: -1,
    buttons: action.buttons_neg || [GamepadButtons.L1],
    keys: action.keys_neg || ['d'],
  }
  const inputMappingRight: ButtonInput = {
    name: action.name + "_right",
    gamepad: -1,
    buttons: action.buttons_pos || [GamepadButtons.R1],
    keys: action.keys_pos || ['a'],
  }

  let resetBtn: ButtonInput = $state({
    gamepad: -1,
    buttons: Array.from(emergencyMapping.buttons),
    keys: Array.from(emergencyMapping.keys),
    name: 'reset to start'
  });

  function getMin() {
    if (action.ui_range && !fullRange) {
      return action.ui_range[0];
    }
    return action.range[0] || 0;
  }

  function getMax() {
    if (action.ui_range && !fullRange) {
      return action.ui_range[1];
    }
    return action.range[1] || 100;
  }

  $effect(() => {
    if (!ui_state.websocket) {
      return
    }

    if (isNaN(value)) {
      value = ui_state.rrc[config.system_name].action_values[action.command];
      return;
    }

    value = Math.max(Math.min(value, getMax()), getMin());

    ui_state.websocket.send(JSON.stringify({
      cmd: action.command,
      sys: config.system_name,
      value
    }));
  });
</script>

<Cell spanDevices={{ desktop: 2, tablet: 1, phone: 1 }}>
  <Paper variant="unelevated">
    <Content>
      {action.name}
      <span class="mobile"><br />
      <b style:font-size="20pt">{value}</b>
      </span>
    </Content>
  </Paper>
</Cell>
<Cell span={1}><Button style="height:80px; background: rgba(0,0,0,0.2);" onpressed={() => {value = updateFromActualValue(-action.step)}} inputMapping={inputMappingLeft}><img alt="left" src="/{action.icon ? action.icon : action.command}_left.png" style:height="80px;"></Button></Cell>
<Cell span={6} class="no_mobile">
  <StepSlider 
    bind:value
    min={getMin()}
    max={getMax()}
    disabled={readonly}
    actualValue={ui_state.rrc[config.system_name].action_values[action.command]}
    step={action.step || 10}
    start={action.start || 0}></StepSlider>
</Cell>
<Cell span={1}><Button style="height:80px; background: rgba(0,0,0,0.2);" onpressed={() => {value = updateFromActualValue(action.step)}} inputMapping={inputMappingRight}><img alt="right" src="/{action.icon ? action.icon : action.command}_right.png" style:height="80px;"></Button></Cell>
<Cell span={1} class="no_mobile">
  <b style:font-size="20pt">{value}</b>
</Cell>
<Cell span={1}>
<IconButton
  style="height: 80px; width:80px;"
  inputMapping={resetBtn}
  onpressed={() => {
    if (action.value_stop) {
      value = action.start;
    } else {
      if (!ui_state.websocket || readonly) {
        return
      }
      ui_state.websocket.send(JSON.stringify({
       cmd: `stop_${action.command}`,
       sys: config.system_name,
       value: action.start || 0
      }));
    }
    return false;
  }}
>
  <Icon class="material-icons">stop</Icon>
</IconButton> &nbsp;
</Cell>

<style>
@media (max-width: 840px) {
  :global(.no_mobile) {
    display: none !important;
  }
}

@media (min-width: 840px) {
  :global(.mobile) {
    display: none !important;
  }
}

  :global(:root) {
    --mdc-layout-grid-margin-desktop: 6px;
    --mdc-layout-grid-gutter-desktop: 10px;
  }
</style>