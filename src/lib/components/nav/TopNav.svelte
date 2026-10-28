<script lang="ts">
	import { IconButton } from 'noph-gamepad-components';
	import { toggleDrawerInput } from '#lib/global_mappings.svelte';
	import type { InputManager } from 'svelte-gamepad-virtual-joystick';

	let {
		title = 'BREMEN Ground Station',
		numGamepads,
		mgr,
		drawer
	}: {
		title?: string;
		numGamepads: number;
		mgr?: InputManager;
		drawer?: HTMLElement;
	} = $props();
</script>

<header>
	<IconButton
		context={['nav', 'default']}
		inputMapping={toggleDrawerInput}
		aria-label="Menu"
		onpressed={() => drawer?.togglePopover()}
	>
		<span class="material-icons">menu</span>
	</IconButton>
	<h1>{title}</h1>
	{#if numGamepads > 0}
		<span class="material-icons gamepad" title="gamepad connected">sports_esports</span>
	{/if}
</header>

<style>
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
