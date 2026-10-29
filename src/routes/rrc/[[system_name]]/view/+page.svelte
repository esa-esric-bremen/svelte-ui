<script lang="ts">
  import { page } from '$app/state';
  import Nav from '#lib/components/nav/Nav.svelte';
  import ScrollableLog from '#lib/components/log/ScrollableLog.svelte';
  import System from '#lib/components/System.svelte';
  import configs from '#lib/configs.js';

  const system_name = (page.params?.system_name ?? 'rpi_robot') as keyof typeof configs;
  const config = configs[system_name];
</script>

<Nav>
  <section class="center_main surface">
    <System readonly={true} {config} />
    <ScrollableLog />
  </section>
</Nav>
