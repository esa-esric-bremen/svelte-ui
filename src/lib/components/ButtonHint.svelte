<script lang="ts">
  import { Snackbar } from 'noph-ui';
  import { hintMapping } from '#lib/global_mappings.svelte.js';
  import { onMount } from 'svelte';

  let showPopover: (() => void) | undefined = $state();

  onMount(() => showPopover?.());
</script>

<Snackbar
  bind:showPopover
  label="Press '{hintMapping.keys[0].toUpperCase()}' or Share to toggle help."
  timeout={6000}
/>
