<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

  import Nav from "$lib/components/nav/Nav.svelte";
	import Paper, { Content } from "@smui/paper";
	import { ui_state } from "$lib/state/ui.svelte";
	import WebsocketData from "$lib/com/WebsocketData";
	import LayoutGrid, { Cell } from "@smui/layout-grid";
	

  onMount(() => {
    if (!browser) {
      return
    }
    if (!ui_state.websocket) {
      ui_state.websocket = new WebsocketData();
      ui_state.websocket.connect();
    }
    
  });

</script>

<Nav>
  <div class="center_main" style:width="100%">
    <Paper style="width: 100%;">
      <Content>
        <LayoutGrid>
          <Cell span={12}>
            <h3>Overview</h3>
          </Cell>
        </LayoutGrid>
        <LayoutGrid>
          <Cell span={3}>
            <Paper variant="outlined">
              <Content>
                <h2>excavated total</h2>
              </Content>
            </Paper>
          </Cell>
          <!--Cell span={3}>
            <Paper variant="outlined">
              <Content>
                <h2>beneficiation</h2>
                {#if ui_state.rrc['beneficiation']}
                <h2>{
                  ((ui_state.rrc['beneficiation'].sensor_value['scale_1'] || 0)
                  + (ui_state.rrc['beneficiation'].sensor_value['scale_2'] || 0)
                  + (ui_state.rrc['beneficiation'].sensor_value['scale_3'] || 0))
                  .toFixed(0)
                } g</h2>
                {:else}
                  (not connected)
                {/if}
              </Content>
            </Paper>
          </Cell>
          <Cell span={3}>
            <Paper variant="outlined">
              <Content>
                <h2>box 1</h2>
                {#if ui_state.rrc['beneficiation']}
                  <h2>{
                    (ui_state.rrc['beneficiation'].sensor_value['scale_1'] || 0)
                    .toFixed(0)
                  }</h2>
                {:else}
                  (not connected)
                {/if}
              </Content>
            </Paper>
          </Cell-->
          <Cell span={3}>
            <Paper variant="outlined">
              <Content>
                <h2>total energy</h2>
                
              </Content>
            </Paper>
          </Cell>
        </LayoutGrid>
      </Content>
    </Paper>
  </div>
</Nav>

<style lang="scss">
  @use '@material/typography/mdc-typography';
  div.center_main {
    max-width: 1200px;
    display: flex;
    justify-content: center; /* Centers horizontally */
    align-items: center; /* Centers vertically */
    margin: 10px auto; /* This centers the block */
  }

  pre {
    white-space: pre-wrap;
  }

  * :global(.card-media-16x9) {
    background-color: black;
  }
</style>