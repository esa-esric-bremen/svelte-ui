<script lang="ts">
  import { page } from '$app/state';
  import { drawerMapping } from '#lib/global_mappings.svelte';
  import { NavigationDrawer } from 'noph-gamepad-components';
  import { NavigationDrawerItem } from 'noph-ui';
  import type { InputManager } from 'svelte-gamepad-virtual-joystick';

  let {
    drawer = $bindable(),
    mgr
  }: {
    drawer?: HTMLElement;
    mgr?: InputManager;
  } = $props();

  const pages = [
    { title: 'Systems', url: '/' },
    { title: 'Coyote with excavation', url: '/coyote_full' },
    { title: 'Overview', url: '/overview' },
    { title: 'Network/System Log', url: '/log' }
    //{title: 'Video Streaming', url: '/streaming'},
    //{title: 'Configuration', url: '/config'},
    // {title: 'Recordings', url: '/rec'},
  ];

  // the gamepad navigates the drawer only while it is open
  function ontoggle(event: ToggleEvent) {
    const open = event.newState === 'open';
    mgr?.changeContext(open ? 'nav' : 'default');
    if (open) {
      drawer?.querySelector<HTMLElement>('.np-navigation-drawer-item')?.focus();
    }
  }
</script>

<NavigationDrawer
  bind:element={drawer}
  modal
  backdrop
  context={['nav']}
  inputMapping={drawerMapping}
  {ontoggle}
>
  {#each pages as item (item.url)}
    <NavigationDrawerItem
      label={item.title}
      href={item.url}
      selected={page.url.pathname === item.url}
      onclick={() => drawer?.hidePopover()}
    />
  {/each}
</NavigationDrawer>
