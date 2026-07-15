<script lang="ts">
  import { ui_state } from '$lib/state/ui.svelte';

  import Card from '@smui/card';
  import List, { Item, Text, PrimaryText, SecondaryText, Graphic } from '@smui/list';
  import { fade } from 'svelte/transition';

  let logContainer: HTMLDivElement | undefined = $state();

  function formatTimestamp(date: Date): string {
    return date.toLocaleString();
  }

  const logLevelIcons = {
    'error': '🛑',
    'warning': '⚠️',
    'info': '🧾'
  }
</script>

<Card style="width: 100%;">
  <div class="log-header">
    <h4>System Log</h4>
  </div>

  <div
    class="log-container"
    bind:this={logContainer}
  >
    {#if ui_state.log.length > 0}
      <List twoLine>
        {#each ui_state.log as logEntry}
        <div in:fade>
          <Item>
            <Graphic>{logLevelIcons[logEntry.level]}</Graphic>
            <Text>
              <PrimaryText>{logEntry.message}</PrimaryText>
              <SecondaryText>{formatTimestamp(logEntry.timestamp)}</SecondaryText>
            </Text>
          </Item>
        </div>
        {/each}
      </List>
    {:else}
      <p class="empty-log"></p>
    {/if}
  </div>
</Card>

<style>
  .log-header {
    padding: 8px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .log-header h4 {
    margin: 0;
  }

  .log-container {
    height: 400px;
    overflow-y: auto;
  }

  .empty-log {
    text-align: center;
    padding: 24px;
    color: #666;
  }

</style>