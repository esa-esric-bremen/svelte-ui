<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { drawerMapping } from '#lib/global_mappings.svelte.js';
  import { NavigationDrawer, IconButton } from 'noph-gamepad-components';
  import { NavigationDrawerItem } from 'noph-ui';
	import { toggleDrawerInput } from '#lib/global_mappings.svelte.js';
  import InputMgr from '../InputMgr.svelte';
  import type { InputManager } from 'svelte-gamepad-virtual-joystick';

  let {
    children,
    title = 'BREMEN Ground Station',
    scrollContent = true
  }: {
    children: Snippet;
    title?: string;
    scrollContent?: boolean;
  } = $props();

  let drawerOpen = $state(false)

  const pages = [
    { title: 'Systems', url: '/' },
    { title: 'Coyote with excavation', url: '/coyote_full' },
    { title: 'Overview', url: '/overview' },
    { title: 'Network/System Log', url: '/log' }
    //{title: 'Video Streaming', url: '/streaming'},
    //{title: 'Configuration', url: '/config'},
    // {title: 'Recordings', url: '/rec'},
  ];

  let mgr: InputManager | undefined = $state();
  let numGamepads = $state(0);

  const onclose = () => {
    mgr?.changeContext('default');
    drawerOpen = false;
  };

  const toggleDrawer = () => {
    drawerOpen = !drawerOpen;
  }
</script>

<InputMgr bind:numGamepads bind:mgr />

<header>
	<IconButton
		context={['nav', 'default']}
		inputMapping={toggleDrawerInput}
		aria-label="Menu"
    aria-expanded={drawerOpen}
		onclick={toggleDrawer}
	>
		<span class="material-icons">{drawerOpen ? 'menu_open' : 'menu'}</span>
	</IconButton>
	<h1>{title}</h1>
	{#if numGamepads > 0}
		<span class="material-icons gamepad" title="gamepad connected">sports_esports</span>
	{/if}
</header>

<NavigationDrawer
  modal
  backdrop
  context={['nav']}
  inputMapping={drawerMapping}
  {onclose}
  open={drawerOpen}
>
  {#each pages as item (item.url)}
    <NavigationDrawerItem
      label={item.title}
      href={item.url}
      selected={page.url.pathname === item.url}
      onclick={() => toggleDrawer}
    />
  {/each}
</NavigationDrawer>

<main class:noscroll={!scrollContent}>
  {@render children?.()}
</main>

<style>
  main {
    padding-top: 56px;
    display: flex;
    flex-direction: column;
  }

  .noscroll {
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
  }
  * :global(.noscroll) {
    overflow: hidden !important;
  }

	header {
		position: fixed;
		inset: 0 0 auto 0;
		height: 48px;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 8px;
		background-color: var(--np-color-surface-container);
		color: var(--np-color-on-surface);
	}

	h1 {
		flex: 1;
		margin: 0;
		font-size: 1.25rem;
		font-weight: 500;
	}

	.gamepad {
		color: var(--np-color-primary);
	}
</style>
