<script lang="ts">
	import { GamepadButtons, Icon as GamepadIcon, Joystick, VirtualButton } from "svelte-gamepad-virtual-joystick";
	import { IconButton } from "smui-gamepad-components";
	import Button, { Icon } from "@smui/button";
	import { emergencyMapping, gamepadActivationMapping } from "$lib/global_mappings.svelte";
	import { onMount } from "svelte";
	import { ui_state } from "$lib/state/ui.svelte";
	import { browser } from "$app/environment";
	import WebsocketData from "$lib/com/WebsocketData";

  const CONTROL_INTERVAL = 100;
  const MIN_SPEED = 0.01;
  const MAX_SPEED = 2.0;

  let control_mode: 'decoupled' | 'coupled' = $state('decoupled');

  const rightJoystickMapping = {
    name: 'robot_control_gamepad_right',
    gamepad: -1,
    axes_x: 2,
    axes_y: 3,
    key_x_pos: ['l'],
    key_x_neg: ['j'],
    key_y_pos: [],
    key_y_neg: [],
    button_x_pos: [],
    button_x_neg: [],
    button_y_neg: [],
    button_y_pos: [],
    disable_axes: ['y'],
    deadzoneX: 0.05,
    deadzoneY: 0.05,
    invert_x: false,
    invert_y: false
  }

  const leftJoystickMapping = {
    name: 'robot_control_gamepad_left',
    gamepad: -1,
    axes_x: 0,
    axes_y: 1,
    key_x_pos: [],
    key_x_neg: [],
    key_y_pos: ['k'],
    key_y_neg: ['i'],
    disable_axes: ['x'],
    button_x_pos: [],
    button_x_neg: [],
    button_y_neg: [],
    button_y_pos: [],
    deadzoneX: 0.05,
    deadzoneY: 0.05,
    invert_x: false,
    invert_y: false
  }

  let {
    system_name,
    speed = $bindable(0.30),
    left_stick = $bindable([0, 0]),
    right_stick = $bindable([0, 0]),
    activated = $bindable(false)
  } = $props<{
    system_name: string,
    speed?: number,
    left_stick?: [x: number, y: number],
    right_stick?: [x: number, y: number],
    activated?: boolean
  }>();

  let controlInterval: number | undefined;

  onMount(() => {
    if (!ui_state.websocket) {
      ui_state.websocket = new WebsocketData();
      ui_state.websocket.connect();
    }

    controlInterval = setInterval(() => {
      if (!browser || !activated) {
        return
      }
      if (!ui_state.websocket) {
        ui_state.websocket = new WebsocketData();
        ui_state.websocket.connect();
      }
      console.log(-left_stick[1] * speed, -right_stick[0] * speed)
      ui_state.websocket.send(JSON.stringify({
        sys: system_name,
        twist: {
          linear_x: -left_stick[1] * speed,
          linear_y: 0,
          linear_z: 0,
          angular_x: 0,
          angular_y: 0,
          angular_z: -right_stick[0] * speed,
        }
      }));
    }, CONTROL_INTERVAL);
    

    return () => {
      activated = false;
      if (controlInterval !== undefined) {
        clearInterval(controlInterval);
      }
    }
  });
</script>


<div style="width: 100%;">
  {#if activated}
    {#if control_mode == "decoupled"}
    <div style="display: flex; justify-content: space-between; align-items: flex-start; max-width: 600px;">
      <div style="position: relative; left: 0px; top:0px;">
        <Joystick
            inputMapping={leftJoystickMapping}
            style="background-color: rgba(0, 0, 0, 0); border: 1px solid #579783; border-radius: 6px;"
            bind:position={left_stick}
        />
        <div style="user-select: none; margin-top: 8px; width: 200px; text-align: center;">
          {(-left_stick[1] * speed).toFixed(3)}<br>
        </div>
      </div>
      <div style="width:150px; text-align: center;">
        <div style="position: relative; width:150px; text-align: center;">
          <IconButton
            style="width: 36px; height: 36px"
            inputMapping={{
              name: 'decrease_duration',
              gamepad: -1,
              buttons: [],
              keys: ['u']
            }}
            onpressed={() => {
              speed = Math.max(speed-0.01, MIN_SPEED);
            }}
          >
            <Icon class="material-icons">remove</Icon>
          </IconButton><span style="user-select: none;">
          &nbsp; {speed.toFixed(2)} &nbsp;
          </span><IconButton
            style="width: 36px; height: 36px"
            inputMapping={{
              name: 'increase_duration',
              gamepad: -1,
              buttons: [],
              keys: ['o']
            }}
            onpressed={() => {
              speed = Math.min(speed+0.01, MAX_SPEED);
            }}
          >
            <Icon class="material-icons">add</Icon>
          </IconButton>
          <div style="float:left;">
            
            <GamepadIcon
              type="keyboard_mouse" 
              input={'u'}
            ></GamepadIcon>
          </div>
          <div style="float:right;">
            
            <GamepadIcon
              type="keyboard_mouse" 
              input={'o'}
            ></GamepadIcon>
          </div>
          <Button
            variant="outlined"
            style="min-height: 60px;"
            onclick={() => {
              activated = false;
            }}>release control</Button>
        </div>
      </div>
      <div style="width:200px;">
        <Joystick
            inputMapping={rightJoystickMapping}
            color="rgb(255, 150, 255)"
            style="background-color: rgba(0, 0, 0, 0); border: 1px solid #c778c8; border-radius: 6px;"
            bind:position={right_stick}
        />
        <div style="user-select: none; margin-top: 8px; width: 200px; text-align: center;">
          {(-right_stick[0] * speed).toFixed(3)}<br>
        </div>
      </div>
    </div>
  {/if}

{:else}
  <div style="
    width: 100%;
    max-width: 600px;
    height: 232px;
    text-align:center;
    display: flex;
    border: 1px solid white;
    border-radius: 6px;
    justify-content: center;
    align-items: center;">
    Press <GamepadIcon
      type="keyboard_mouse" 
      input={gamepadActivationMapping.keys[0]}></GamepadIcon> or <GamepadIcon
      type="generic" 
      input={gamepadActivationMapping.buttons[0]}></GamepadIcon> to 
      <Button
          variant="text"
          onclick={() => {
            activated = !activated;
          }}>request robot control</Button>.
  </div>
{/if}
</div>


<VirtualButton
  context={['default']}
  onpressed={() => {
    activated = !activated
  }}
  inputMapping={gamepadActivationMapping}
></VirtualButton>
<VirtualButton
  context={['default', 'nav']}
  onpressed={() => {
    activated = false
  }}
  inputMapping={emergencyMapping}
></VirtualButton>