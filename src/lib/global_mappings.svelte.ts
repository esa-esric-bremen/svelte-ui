// Global Keyboard/Gamepad inputs.
import { GamepadButtons, type ButtonInput, type PrevNextInput } from "svelte-gamepad-virtual-joystick";

export const hintMapping = {
  name: 'Hint',
  gamepad: -1,
  buttons: [GamepadButtons.SHARE],
  keys: ['h']
}

export const gamepadActivationMapping = {
  name: 'GamepadActivationMapping',
  gamepad: -1,
  buttons: [GamepadButtons.AXIS_BUTTON_LEFT],
  keys: ['e']
}

export const emergencyMapping: ButtonInput = {
  name: 'EmergencyOff',
  gamepad: -1,
  buttons: [GamepadButtons.HOME],
  keys: [' ']
}

export const toggleDrawerInput: ButtonInput = {
  gamepad: -1,
  buttons: [GamepadButtons.OPTIONS],
  keys: ['q'],
  name: 'toggle drawer'
};

export const drawerMapping: PrevNextInput = $state({
  name: 'List',
  gamepad: -1,
  axes: [1],
  sensitivity: 0.05,
  buttons: [GamepadButtons.DOWN],
  buttons_prev: [GamepadButtons.DPAD_UP],
  buttons_next: [GamepadButtons.DPAD_DOWN],
  keys_prev: ['w'],
  keys_next: ['s'],
  keys: ['e']  // activate
});