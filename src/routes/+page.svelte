<script lang="ts">
  import Nav from '#lib/components/nav/Nav.svelte';
  import { goto } from '$app/navigation';
  import { Button, Card } from 'noph-ui';
  import { IconButton } from 'noph-gamepad-components';
  import { GamepadButtons, Icon as GamepadIcon } from 'svelte-gamepad-virtual-joystick';

  const entries = [
    {
      name: 'Excavation',
      image: '/rpi_robot.png',
      view: '/rrc/rpi_robot/view',
      control: '/rrc/rpi_robot/control',
      inputMapping: { name: 'rpi_robot', gamepad: -1, buttons: [GamepadButtons.TRIANGLE], keys: ['e'] }
    },
    {
      name: 'Coyote Robot',
      image: '/coyote.png',
      view: '/rrc/coyote/view',
      control: '/rrc/coyote/control',
      inputMapping: { name: 'coyote', gamepad: -1, buttons: [GamepadButtons.CIRCLE], keys: ['c', 'r'] }
    },
    {
      name: 'Coyote + Excavation',
      image: '/rpi_robot.png',
      view: '/',
      control: '/coyote_full',
      inputMapping: { name: 'coyote_full', gamepad: -1, buttons: [GamepadButtons.CROSS], keys: ['f'] }
    }
  ];
</script>

<Nav>
  <div class="center_main card-grid">
    {#each entries as entry (entry.control)}
      <Card type="text" variant="filled" image={entry.image} headline={entry.name}>
        <div class="card-actions">
          <IconButton variant="text" onclick={() => goto(entry.view)}>
            <span class="material-icons">visibility</span>
          </IconButton>
          <IconButton
            variant="filled"
            aria-label="Control"
            title="Control"
            inputMapping={entry.inputMapping}
            onclick={() => goto(entry.control)}
          >
            <span class="material-icons">play_arrow</span>
          </IconButton>
          <div>
            <GamepadIcon height={30} type="keyboard_mouse" input={entry.inputMapping.keys[0]} /><br />
            <GamepadIcon height={30} type="ps4" input={entry.inputMapping.buttons[0]} />
          </div>
        </div>
      </Card>
    {/each}
  </div>
</Nav>

<style>
  .card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  :global(.np-card-image) {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: black;
  }
</style>
