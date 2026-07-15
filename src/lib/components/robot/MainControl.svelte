<script lang="ts">
  // Full view of coyote with excavation AND coyote control
  import { onMount } from "svelte";
  import WebsocketData from "$lib/com/WebsocketData";
  import { addLogMessage, toggleTask, ui_state } from "$lib/state/ui.svelte";

  import yaml from 'js-yaml';

  import { Icon as GamepadIcon, VirtualButton } from 'svelte-gamepad-virtual-joystick';

  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import Paper, {Content} from "@smui/paper";
  import Graph from "$lib/components/graph/Graph.svelte";
  import type { IGraphConfig } from "$lib/interfaces/IGraphConfig";
  import ScrollableLog from "$lib/components/log/ScrollableLog.svelte";
  import Snackbar, { Label as SnackbarLabel } from  '@smui/snackbar';

  import Nav from "$lib/components/nav/Nav.svelte"
  import ActionSlider from "$lib/components/base/ActionSlider.svelte";
  import { emergencyMapping, gamepadActivationMapping, hintMapping } from "$lib/global_mappings.svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";

  import config_rpi_robot from '$lib/data/config_rpi_robot.yaml?raw';
//  import config_beneficiation from '$lib/data/config_beneficiation.yaml?raw';
  import config_coyote from '$lib/data/config_coyote.yaml?raw';
	import type IConfig from "$lib/interfaces/IConfig";
	import type ISensor from "$lib/interfaces/ISensor";
	import { Button } from "smui-gamepad-components";

  const configs: {[name: string]: IConfig} = {
    rpi_robot: yaml.load(config_rpi_robot) as IConfig,
    coyote: yaml.load(config_coyote) as IConfig
  }

  let lastNumber = -1.0;

  function errorClass(min_okay: number, max_okay: number, value: number) {
    if (max_okay && value > max_okay) {
      return 'red_alert';
    }
    if (min_okay && value < min_okay) {
      return 'red_alert';
    }
    return '';
  }
</script>