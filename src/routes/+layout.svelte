<script lang="ts">
  import 'noph-ui/defaultTheme';
  import '#lib/app.css';
  import type { LayoutProps } from './$types';

  let { children } = $props();
</script>

<svelte:head>
</svelte:head>

{@render children?.()}
