<script lang="ts">
  import CircularProgress from '@smui/circular-progress';
</script>

<div class="loading-container">
  <CircularProgress style="height: 64px; width: 64px;" indeterminate />
  <h5>
    Loading...
  </h5>
</div>

<style lang="scss">
  @use '@material/typography/index' as typography;

  h5 {
    @include typography.typography('headline5');
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>