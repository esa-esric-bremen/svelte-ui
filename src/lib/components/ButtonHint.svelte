<script lang="ts">
  import { Snackbar } from 'noph-ui';
  import { hintMapping } from '#lib/global_mappings.svelte.js';
  import { onMount } from 'svelte';

  let open = $state(false);

  onMount(() => (open = true));
</script>

<Snackbar
  bind:open
  label="Press '{hintMapping.keys[0].toUpperCase()}' or Share to toggle help."
  timeout={6000}
/>
