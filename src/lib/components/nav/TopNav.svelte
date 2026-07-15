<script lang="ts">
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
  import { Fab, IconButton as IB, List } from 'smui-gamepad-components';
  import { toggleDrawerInput } from '$lib/global_mappings.svelte';
	import { type InputManager } from 'svelte-gamepad-virtual-joystick';

  interface Props {
    showSideNav?: boolean
    title?: string
    numGamepads: number
    mgr?: InputManager
    navList: List
  }

  let {
    showSideNav = $bindable(false),
    title = "BREMEN Ground Station",
    mgr = $bindable(),
    navList = $bindable(),
    numGamepads
  }: Props = $props();

</script>

<TopAppBar
  variant="fixed"
  dense
>
  <Row>
    <Section>
      <IB
        context={['nav', 'default']}
        inputMapping={toggleDrawerInput}
        onpressed={() => {
          showSideNav = !showSideNav;
          if (!mgr) return
          if (showSideNav) {
            mgr.changeContext('nav');
            navList.focus();
          } else {
            mgr.changeContext('default');
          }
          
        }}>
          <IconButtonIcon class="material-icons">menu</IconButtonIcon>
        </IB>
        <Title>{title}</Title>
    </Section>
    {#if numGamepads > 0}
      <IconButton  class="material-icons">
        sports_esports_rounded
      </IconButton>
    {/if}
  </Row>
</TopAppBar>