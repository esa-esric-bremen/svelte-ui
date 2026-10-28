<script lang="ts">
  import { CircularProgress } from 'noph-ui';
</script>

<div class="loading-container">
  <CircularProgress indeterminate />
  <h5>
    Loading...
  </h5>
</div>

<style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    height: 100vh;
  }
</style>
