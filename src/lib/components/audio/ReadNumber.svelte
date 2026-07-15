<script lang="ts">
	import type IConfig from "$lib/interfaces/IConfig";
	import { ui_state } from "$lib/state/ui.svelte";

  let {
    config,
    scale_name = 'scale'
  }: {
    config: IConfig
    scale_name: string
  } = $props();

  let audioOut: HTMLAudioElement;
  let lastNumber = -1.0;

  function playNumber(outNumber: String) {
    if (outNumber.length == 0 || outNumber == '.0' || outNumber == 'NaN') {
      audioOut.onended = null;
      return;
    }
    console.log(outNumber)
    let next = outNumber[0];
    if (next == '.') {
      next = 'p';
    }
    if (next == '-') {
      return;
    }
    audioOut.setAttribute("src", `/voice/${next}.wav`);
    audioOut.onended = () => {playNumber(outNumber.substring(1))};
    audioOut.play();
  }

  $effect(() => {
    if (!config || !ui_state.rrc[config.system_name]) {
      return;
    }
    const currentNumber: number = ui_state.rrc[config.system_name].sensor_value[scale_name];

    if (lastNumber < 0) {
      playNumber((currentNumber / 1000).toFixed(1));
      lastNumber = currentNumber;
      return
    }

    if (currentNumber < 0) {
      if (lastNumber != 0) {
        playNumber('0');
        lastNumber = 0;
      }
      return;
    }
    if (Math.floor(currentNumber / 500) != Math.floor(lastNumber / 500)) {
      playNumber((currentNumber / 1000).toFixed(1));
      lastNumber = currentNumber;
    }
  })
</script>

<audio bind:this={audioOut}></audio>