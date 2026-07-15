<script lang="ts">
  import { toggleTask, ui_state } from "$lib/state/ui.svelte";

  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import SmuiButton from "@smui/button";
  import Paper, {Content} from "@smui/paper";
  import ScrollableLog from "$lib/components/log/ScrollableLog.svelte";

  import Nav from "$lib/components/nav/Nav.svelte"
	import { page } from "$app/state";

	import type IConfig from "$lib/interfaces/IConfig";
	import { Button } from "smui-gamepad-components";

	import ReadNumber from "$lib/components/audio/ReadNumber.svelte";
	import ButtonHint from "$lib/components/ButtonHint.svelte";

  import configs from "$lib/configs";
	import System from "$lib/components/System.svelte";
	import { component_state } from "svelte-gamepad-virtual-joystick";

  let fullRange = $state(false);

  const system_name: 'rpi_robot' | 'coyote' = page.params?.system_name || 'rpi_robot';
  const config: IConfig = (system_name) ? configs[system_name] : configs['rpi_robot'];

</script>
{#if config.system_name == 'rpi_robot'}
<ReadNumber {config} scale_name={'scale'} />
{/if}

<Nav>
  <div class="center_main">
    <Paper>
      <Content>
        <Button
            variant={fullRange ? 'raised' : 'outlined'}
            onpressed={()=>{
              fullRange = !fullRange;
            }}
            inputMapping={{
              name: 'toggle_button_range',
              gamepad: -1,
              buttons: [],
              keys: []
            }}
          >full range</Button>
          <SmuiButton
            variant={component_state.showHints ? 'raised' : 'outlined'}
            onclick={() => {component_state.showHints = !component_state.showHints}}
          >Show hints</SmuiButton><br />
      <System config={configs[system_name]} {fullRange} />
      <ScrollableLog></ScrollableLog>
      </Content>
    </Paper>
  </div>
</Nav>

<ButtonHint />
