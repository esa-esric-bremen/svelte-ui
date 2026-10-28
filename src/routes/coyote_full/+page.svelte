<script lang="ts">
  // Full view of coyote with excavation AND coyote control
  import Nav from '#lib/components/nav/Nav.svelte';
  import ButtonHint from '#lib/components/ButtonHint.svelte';
  import ControlToolbar from '#lib/components/ControlToolbar.svelte';
  import System from '#lib/components/System.svelte';
  import configs from '#lib/configs';

  let fullRange = $state(false);
</script>

<Nav>
  <section class="center_main surface">
    <ControlToolbar bind:fullRange />
    <h1>Coyote</h1>
    <System config={configs['coyote']} {fullRange} />
    <h1>Excavation</h1>
    <System config={configs['rpi_robot']} {fullRange} />
  </section>
</Nav>
<ButtonHint />
