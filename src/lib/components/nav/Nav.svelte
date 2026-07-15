<script lang="ts">
	import type { Snippet } from "svelte";
	import InputMgr from "../InputMgr.svelte";
  import SideNav from "./SideNav.svelte";
  import TopNav from "./TopNav.svelte";
  import { AppContent } from '@smui/drawer';
  import TopAppBar, { AutoAdjust } from '@smui/top-app-bar';
	import type { InputManager } from "svelte-gamepad-virtual-joystick";
	import type { List } from "smui-gamepad-components";

  interface Props {
    children: Snippet
    showSideNav?: boolean
    // allow the content to be scrolled, not wanted e.g. in manual control screen
    scrollContent?: boolean
  }

  let {
    children,
    showSideNav = $bindable(false),
    scrollContent = true,
  }: Props = $props();

  let mgr: InputManager = $state();
  let numGamepads = $state(0);
  let topAppBar: TopAppBar | undefined = $state();
  let navList: List = $state();

</script>

<InputMgr bind:numGamepads bind:mgr />

<div class="drawer-container">

<TopNav bind:topAppBar {numGamepads} bind:showSideNav bind:mgr bind:navList />

<AutoAdjust {topAppBar}>
  <SideNav bind:open={showSideNav} bind:mgr bind:navList />
  <AppContent class={scrollContent ? "app-content" : "app-content noscroll"}>
    <main>
      {@render children?.()}
    </main>
  </AppContent>
</AutoAdjust>

</div>

<style lang="scss">

  * :global(.noscroll) {
    overflow: hidden !important;
  }
  
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  * :global(.app-content) {
    flex: auto;
    flex-grow: 1;
    display: flex;
  }

</style>