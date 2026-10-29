<script lang="ts">
  import 'noph-ui/defaultTheme';
  import '#lib/app.css';
  import { onMount } from 'svelte';
  import { startAll } from '#lib/rrc/clients.js';

  let { children } = $props();

  onMount(startAll);
</script>

{@render children?.()}
