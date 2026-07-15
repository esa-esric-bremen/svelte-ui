<script lang="ts">
  // Full view of coyote with excavation AND coyote control
	import { Button } from "smui-gamepad-components";
  import SmuiButton from "@smui/button";

  import Paper, {Content} from "@smui/paper";

  import Nav from "$lib/components/nav/Nav.svelte"

	import ButtonHint from "$lib/components/ButtonHint.svelte";

	import System from "$lib/components/System.svelte";
	import configs from "$lib/configs";
	import { component_state } from "svelte-gamepad-virtual-joystick";

  let fullRange = $state(false);
</script>

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
        <h1>Coyote</h1>
        <System config={configs['coyote']} {fullRange} />
        <h1>Excavation</h1>
        <System config={configs['rpi_robot']} {fullRange} />
      </Content>
    </Paper>
  </div>
</Nav>
<ButtonHint />