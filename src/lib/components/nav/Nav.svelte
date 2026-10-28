<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { InputManager } from 'svelte-gamepad-virtual-joystick';
  import InputMgr from '../InputMgr.svelte';
  import SideNav from './SideNav.svelte';
  import TopNav from './TopNav.svelte';

  let {
    children,
    scrollContent = true
  }: {
    children: Snippet;
    scrollContent?: boolean;
  } = $props();

  let mgr: InputManager | undefined = $state();
  let numGamepads = $state(0);
  let drawer: HTMLElement | undefined = $state();
</script>

<InputMgr bind:numGamepads bind:mgr />
<TopNav {numGamepads} {mgr} {drawer} />
<SideNav bind:drawer {mgr} />

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
</style>
