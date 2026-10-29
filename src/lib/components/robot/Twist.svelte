<script lang="ts">
	import { GamepadButtons, Icon as GamepadIcon, Joystick, VirtualButton } from "svelte-gamepad-virtual-joystick";
	import { IconButton } from "noph-gamepad-components";
	import { Button } from "noph-ui";
	import { emergencyMapping, gamepadActivationMapping } from "#lib/global_mappings.svelte.js";
	import { onMount } from "svelte";
	import { rrc } from "#lib/rrc/clients.js";

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
  }: {
    system_name: string,
    speed?: number,
    left_stick?: [x: number, y: number],
    right_stick?: [x: number, y: number],
    activated?: boolean
  } = $props();


  onMount(() => {
    const client = rrc(system_name);
    // send a single stop when control is released, otherwise the last twist keeps running
    let stopped = true;
    const controlInterval = setInterval(() => {
      if (!activated) {
        if (!stopped) {
          client.setTwist(0, 0);
          stopped = true;
        }
        return;
      }
      stopped = false;
      client.setTwist(-left_stick[1] * speed, -right_stick[0] * speed);
    }, CONTROL_INTERVAL);

    return () => {
      clearInterval(controlInterval);
      if (!stopped) {
        client.setTwist(0, 0);
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
            size="s"
            inputMapping={{
              name: 'decrease_duration',
              gamepad: -1,
              buttons: [],
              keys: ['u']
            }}
            onclick={() => {
              speed = Math.max(speed-0.01, MIN_SPEED);
            }}
          >
            <span class="material-icons">remove</span>
          </IconButton><span style="user-select: none;">
          &nbsp; {speed.toFixed(2)} &nbsp;
          </span><IconButton
            size="s"
            inputMapping={{
              name: 'increase_duration',
              gamepad: -1,
              buttons: [],
              keys: ['o']
            }}
            onclick={() => {
              speed = Math.min(speed+0.01, MAX_SPEED);
            }}
          >
            <span class="material-icons">add</span>
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
    border: 1px solid var(--np-color-outline);
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
