<script lang="ts">
	import { ui_state } from '#lib/state/ui.svelte';
	import { Card, List, ListItem } from 'noph-ui';

  function formatTimestamp(date: Date): string {
    return date.toLocaleString();
  }

  const logLevelIcons = {
    'error': '🛑',
    'warning': '⚠️',
    'info': '🧾'
  }
</script>

<Card type="text" variant="outlined" headline="System Log">
  <div class="log-container">
    <List>
      {#each ui_state.log as entry}
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
  .log-container {
    height: 400px;
    overflow-y: auto;
  }

</style>
