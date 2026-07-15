<script lang="ts">
  import Slider from "@smui/slider";
  import { getContext, onMount, setContext } from 'svelte';

  setContext('SMUI:label:context', getContext('SMUI:label:context'));
  setContext('SMUI:form-field:context', getContext('SMUI:form-field:context'));

  let {
    value = $bindable(0),
    actualValue = undefined,
    min = -1000,
    max = 1000,
    step = 50,
    start = 0,
    disabled = false,
  } = $props<{
    value?: number;
    actualValue?: number;
    min?: number;
    max?: number;
    step?: number;
    start?: number;
    disabled?: boolean;
  }>();

  let steps: {value: number, position: number}[] = $state([]);
  let deadzoneMarker: {min: number, max: number}[] = $state([]);

  let actualValuePosition = $state<number | undefined>(undefined);

  $effect(() => {
    if (step <= 0 || min >= max) {
      return;
    }

    let _step = step;
    const markersMap = new Map<number, { value: number, position: number }>();
    const totalRange = max - min;
    let showSteps = true;

    if (totalRange / step > 100) {
      _step *= 10;
    } else if (totalRange / step > 200) {
      showSteps = false;
    }
    if (showSteps) {
      for (let i = min; i <= max; i += _step) {
        const positionPercent = ((i - min) / totalRange) * 100;
        markersMap.set(i, {
          value: i,
          position: positionPercent
        });
      }
    }

    if (min < 0 && max > 0) {
      if (!markersMap.has(0)) {
        const zeroPosition = ((0 - min) / totalRange) * 100;
        markersMap.set(0, { value: 0, position: zeroPosition });
      }
    }

    steps = Array.from(markersMap.values());

    if (actualValue == null) {
      actualValuePosition = undefined;
    } else {
      const positionPercent = ((actualValue - min) / totalRange) * 100;
      actualValuePosition = Math.max(0, Math.min(100, positionPercent));
    }
  });

</script>

<div class="slider-wrapper">
  <div class="deadzone-container">
    {#each deadzoneMarker as dz}
      <div
        class="deadzone-line"
        style:left="{dz.min}%"
        style:width="{dz.max}%"
      ></div>
    {/each}
  </div>
  <div class="tick-container">
    {#each steps as stepMarker}
      <div
        class="tick-line"
        data-value={stepMarker.value}
        class:is-zero={stepMarker.value == start}
        style:left="{stepMarker.position}%"
      ></div>
    {/each}
  </div>

  {#if actualValuePosition !== undefined}
  <div class="arrow-container">
    <div
      class="actual-value-arrow"
      style:left={`${actualValuePosition}%`}
      title={actualValue}
    ></div>
  </div>
  {/if}

  <Slider
    bind:value
    {disabled}
    {min}
    {max}
    {step}
    {start}
    class="custom-slider" />

</div>

<style>
  .slider-wrapper {
    position: relative;
    padding-bottom: 0px;
    box-sizing: border-box;
  }

  .tick-container {
    position: absolute;
    bottom: 0;
    margin: 0 24px;
    left: 0;
    right: 0;
    height: 14px;
    z-index: 0;
    pointer-events: none;
  }

  .tick-line {
    position: absolute;
    bottom: 0;
    width: 1.25px;
    height: 100%;
    background-color: #BDBDBD;
    transform: translateX(-50%);
  }

  .tick-line.is-zero {
    width: 2px;
    background-color: #d32f2f;
  }

  :global(.custom-slider) {
    margin: 0 24px;
    z-index: 1;
  }

  .arrow-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    margin: 0 24px;
    pointer-events: none;
  }

  .actual-value-arrow {
    position: absolute;
    top: -8px; 
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #007bff;
    transform: translateX(-50%);
    z-index: 0;
    pointer-events: none;
  }

</style>