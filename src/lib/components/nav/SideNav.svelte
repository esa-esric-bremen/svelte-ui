<script lang="ts">
	import { goto } from "$app/navigation";
	import { drawerMapping } from "$lib/global_mappings.svelte";
	import Drawer, { Content } from "@smui/drawer";
	import { Item, Text } from "@smui/list";
	import { List } from "smui-gamepad-components";
	import type { InputManager } from "svelte-gamepad-virtual-joystick";

  interface Props {
    mgr?: InputManager
    open?: boolean
    navList?: List
  }

  let {
    navList = $bindable(),
    open = $bindable(false),
    mgr = $bindable()
  }: Props = $props();

  const pages = [
    {title: 'Systems', url: '/'},
    {title: 'Coyote with excavation', url: '/coyote_full'},
    {title: 'Overview', url: '/overview'},
    {title: 'Network/System Log', url: '/log'},
    //{title: 'Video Streaming', url: '/streaming'},
    //{title: 'Configuration', url: '/config'},
    // {title: 'Recordings', url: '/rec'},
  ]

  function gotoIdx(idx: number) {
    open = false;
    if (idx < 0 || idx > pages.length ) {
      return;
    }
    const url = pages[idx].url;
    if (url.startsWith('/')) {
      goto(url);
    } else {
      goto(`/${url}`)
    }
  }

  let selectionIndex: number = $state(0);
</script>

<div class="drawer-container">
<Drawer
    variant="dismissible"
    style="max-height: calc(100vh); position:fixed;"
    bind:open>
  <Content>
    <List
      bind:this={navList}
      bind:selectedIndex={selectionIndex}
      context={['nav']}
      inputMapping={drawerMapping}
      onpressed={() => {
        if (mgr) {
          mgr.changeContext('default');
        }
        gotoIdx(selectionIndex);
        return false;
      }}
    >

      {#each pages as item, i}
        <Item
          onSMUIAction={() => {
            if (mgr) {
              mgr.changeContext('default');
            }
            selectionIndex = i;
            gotoIdx(i);
          }}
          selected={selectionIndex === i}
        >
          <Text>{item.title}</Text>
        </Item>
      {/each}
    </List>
  </Content>
</Drawer>
</div>

<style>
  /* These classes are only needed because the
    drawer is in a container on the page. */
  .drawer-container {
    padding-top: 48px;
    max-width: 600px;
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    overflow: hidden;
  }
</style>
