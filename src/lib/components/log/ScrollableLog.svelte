<script lang="ts">
	import { ui_state } from '#lib/state/ui.svelte.js';
	import { Card, List, ListItem } from 'noph-ui';

  function formatTimestamp(date: Date): string {
    return date.toLocaleString();
  }

  const logLevelIcons: Record<string, string> = {
    'error': '🛑',
    'warning': '⚠️',
    'info': '🧾'
  }
</script>

<Card type="text" variant="outlined" headline="System Log" class="log-card">
  <div class="log-container">
    <List>
      {#each ui_state.log as entry, i (i)}
        <ListItem>
          {#snippet start()}{logLevelIcons[entry.level]}{/snippet}
          {entry.message}
          {#snippet supportingText()}{formatTimestamp(entry.timestamp)}{/snippet}
        </ListItem>
      {/each}
    </List>
  </div>
</Card>

<style>
  /* noph cards are inline-flex and shrink to their content */
  :global(.np-card-container.log-card) {
    display: flex;
    width: 100%;
  }

  .log-container {
    height: 400px;
    overflow-y: auto;
  }

</style>
