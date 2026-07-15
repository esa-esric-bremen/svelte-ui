<script lang="ts">
  import ScrollableLog from "$lib/components/log/ScrollableLog.svelte";
  import Nav from "$lib/components/nav/Nav.svelte";
  import Paper from "@smui/paper";
</script>

<Nav>
  <div class="center_main">
    <Paper>
<ScrollableLog></ScrollableLog>
    </Paper>
  </div>
</Nav>