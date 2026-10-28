<script lang="ts">
  import { page } from '$app/state';
  import Nav from '#lib/components/nav/Nav.svelte';
  import ScrollableLog from '#lib/components/log/ScrollableLog.svelte';
  import ReadNumber from '#lib/components/audio/ReadNumber.svelte';
  import ButtonHint from '#lib/components/ButtonHint.svelte';
  import ControlToolbar from '#lib/components/ControlToolbar.svelte';
  import System from '#lib/components/System.svelte';
  import configs from '#lib/configs';

  let fullRange = $state(false);

  const system_name = (page.params?.system_name ?? 'rpi_robot') as keyof typeof configs;
  const config = configs[system_name];
</script>

{#if config.system_name == 'rpi_robot'}
  <ReadNumber {config} scale_name="scale" />
{/if}

<Nav>
  <section class="center_main surface">
    <ControlToolbar bind:fullRange />
    <System {config} {fullRange} />
    <ScrollableLog />
  </section>
</Nav>

<ButtonHint />
