<script lang="ts">
	import Nav from "$lib/components/nav/Nav.svelte";

  // SMUI
  import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '@smui/card'
	import { goto } from "$app/navigation";
	import { IconButton } from "smui-gamepad-components";
	import { Icon } from "@smui/button";
	import Paper from "@smui/paper";
  import { GamepadButtons, Icon as GamepadIcon } from "svelte-gamepad-virtual-joystick";

  const rrcs = [
    // {
    //   system_name: 'beneficiation',
    //   name: "Beneficiation",
    //   desc: "Stationary Beneficiation System",
    //   inputMapping: {
    //     gamepad: -1,
    //     buttons: [GamepadButtons.SQUARE],
    //     keys: ['b']
    //   }
    // },
    {
      system_name: 'rpi_robot',
      name: "Excavation",
      desc: "Excavation System on Coyote",
      inputMapping: {
        gamepad: -1,
        buttons: [GamepadButtons.TRIANGLE],
        keys: ['e']
      }
    },
    {
      system_name: 'coyote',
      name: "Coyote Robot",
      desc: "Coyote 3 Control",
      inputMapping: {
        gamepad: -1,
        buttons: [GamepadButtons.CIRCLE],
        keys: ['c', 'r']
      }
    }
  ]
  const coyote_full = {
    inputMapping: {
      gamepad: -1,
      buttons: [GamepadButtons.CROSS],
      keys: ['f']
    }
  }
</script>

<Nav>
  <div class="center_main" style="max-width: 1200px;">
      <LayoutGrid>
        {#each rrcs as rrc}
        <Cell span={3}>
          <Card>
            <PrimaryAction onclick={() => {
              goto(`/rrc/${rrc.system_name}/view`)
            }}>
            <Media class="card-media-16x9" aspectRatio="16x9" >
              <MediaContent >
                <div style={"background-image: url(/" + rrc.system_name + ".png); width: 100%; height: 100%;background-size: contain; background-position: center; background-repeat: no-repeat;" }>
                <h2
                  class="mdc-typography--headline6"
                  style="color: #fff; position: absolute; bottom: 6px; left: 10px; margin: 0;"
                >
                  {rrc.name}
                </h2>
                </div>
              </MediaContent>
            </Media>
            <Content style="color: #888;"></Content>
            </PrimaryAction>
          <Actions>
            <ActionIcons>
              <IconButton
                toggle
                aria-label="Control"
                title="Control"
                inputMapping={
                  rrc.inputMapping
                }
                onpressed={() => {
                  goto(`/rrc/${rrc.system_name}/control`)
                }}
                >
                <Icon class="material-icons" on>pause</Icon>
                <Icon class="material-icons">play_arrow</Icon>
              </IconButton>
              <div>
              <GamepadIcon
                height={30}
                type="keyboard_mouse"
                input={rrc.inputMapping.keys[0]}
                /><br />
              <GamepadIcon
                height={30}
                type="ps4"
                input={rrc.inputMapping.buttons[0]}
                />
              </div>
            </ActionIcons>
          </Actions>
          </Card>
        </Cell>
      {/each}

        <Cell span={3}>
          <Card>
            <PrimaryAction onclick={() => {
              goto(`/`)
            }}>
            <Media class="card-media-16x9" aspectRatio="16x9" >
              <MediaContent >
                <div style={"background-image: url(/rpi_robot.png); width: 100%; height: 100%;background-size: contain; background-position: center; background-repeat: no-repeat;" }>
                <h2
                  class="mdc-typography--headline6"
                  style="color: #fff; position: absolute; bottom: 6px; left: 10px; margin: 0;"
                >
                  Coyote + Excavation
                </h2>
                </div>
              </MediaContent>
            </Media>
            <Content style="color: #888;"></Content>
            </PrimaryAction>
          <Actions>
            <ActionIcons>
              <IconButton
                toggle
                aria-label="Control"
                title="Control"
                inputMapping={
                  coyote_full.inputMapping
                }
                onpressed={() => {
                  goto(`/coyote_full`)
                }}
                >
                <Icon class="material-icons" on>pause</Icon>
                <Icon class="material-icons">play_arrow</Icon>
              </IconButton>
              <div>
              <GamepadIcon
                height={30}
                type="keyboard_mouse"
                input={coyote_full.inputMapping.keys[0]}
                /><br />
              <GamepadIcon
                height={30}
                type="ps4"
                input={coyote_full.inputMapping.buttons[0]}
                />
              </div>
            </ActionIcons>
          </Actions>
          </Card>
        </Cell>

      </LayoutGrid>
  </div>
</Nav>