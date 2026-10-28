<script lang="ts">
  import { Slider } from 'noph-gamepad-components';
  import type { SliderInput } from 'svelte-gamepad-virtual-joystick';

  let {
    value = $bindable(0),
    actualValue = undefined,
    min = -1000,
    max = 1000,
    step = 50,
    start = 0,
    disabled = false
  }: {
    value?: number;
    actualValue?: number;
    min?: number;
    max?: number;
    step?: number;
    start?: number;
    disabled?: boolean;
  } = $props();

  const inputMapping: SliderInput = {
    name: 'StepSlider',
    gamepad: -1,
    sensitivity: 0.05,
    axes: 0,
    buttons: [],
    buttons_neg: [],
    buttons_pos: [],
    keys: [],
    keys_neg: [],
    keys_pos: [],
    invert: false
  };

  const position = (v: number) => ((v - min) / (max - min)) * 100;

  const ticks = $derived.by(() => {
    if (step <= 0 || min >= max) return [];
    const range = max - min;
    if (range / step > 200) return [];
    const tickStep = range / step > 100 ? step * 10 : step;
    const values = new Set<number>();
    for (let v = min; v <= max; v += tickStep) values.add(v);
    if (min < 0 && max > 0) values.add(0);
    return [...values];
  });

  const actualPosition = $derived(
    actualValue == null ? undefined : Math.max(0, Math.min(100, position(actualValue)))
  );
</script>

<div class="slider-wrapper">
  <div class="tick-container">
    {#each ticks as tick (tick)}
      <div class="tick-line" class:is-start={tick == start} style:left="{position(tick)}%"></div>
    {/each}
  </div>

  {#if actualPosition !== undefined}
    <div class="arrow-container">
      <div class="actual-value-arrow" style:left="{actualPosition}%" title={String(actualValue)}></div>
    </div>
  {/if}

  <Slider bind:value {disabled} {min} {max} {step} {inputMapping} addHints={false} showValue={false} size="s" />
</div>

<style>
  .slider-wrapper {
    position: relative;
    padding: 10px 0 16px;
  }

  .tick-container,
  .arrow-container {
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;
  }

  .tick-container {
    bottom: 0;
    height: 12px;
  }

  .tick-line {
    position: absolute;
    bottom: 0;
    width: 1.25px;
    height: 100%;
    background-color: var(--np-color-outline);
    transform: translateX(-50%);
  }

  .tick-line.is-start {
    width: 2px;
    background-color: var(--np-color-error);
  }

  .arrow-container {
    top: 0;
    height: 8px;
    z-index: 1;
  }

  .actual-value-arrow {
    position: absolute;
    top: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid var(--np-color-tertiary);
    transform: translateX(-50%);
  }
</style>
