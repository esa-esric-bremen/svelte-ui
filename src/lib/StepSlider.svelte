<script lang="ts">
  import { Slider } from 'noph-gamepad-components';
  import { onDestroy } from 'svelte';
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
  const trackLeft = (percent: number) =>
    `calc(var(--np-slider-layer-inset, 6px) + ${percent / 100} * (100% - 2 * var(--np-slider-layer-inset, 6px)))`;

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

  // Value label shown on every change.
  const LABEL_VISIBLE_MS = 1200;
  let labelVisible = $state(false);
  let labelTimer: ReturnType<typeof setTimeout> | undefined;
  let lastValue = value;

  $effect(() => {
    if (value === lastValue) return;
    lastValue = value;
    labelVisible = true;
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => (labelVisible = false), LABEL_VISIBLE_MS);
  });
  onDestroy(() => clearTimeout(labelTimer));

  // as many decimals as the step has
  const decimals = $derived(step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step))) : 0);
  const labelPosition = $derived(Math.max(0, Math.min(100, position(value))));

  const actualPosition = $derived(
    actualValue == null ? undefined : Math.max(0, Math.min(100, position(actualValue)))
  );
</script>

<div class="slider-wrapper">
  <div class="tick-container">
    {#each ticks as tick (tick)}
      <div class="tick-line" class:is-start={tick == start} style:left={trackLeft(position(tick))}></div>
    {/each}
  </div>

  <div class="label-container" aria-hidden="true">
    <div class="value-indicator" class:visible={labelVisible} style:left={trackLeft(labelPosition)}>
      {value.toFixed(decimals)}
    </div>
  </div>

  {#if actualPosition !== undefined}
    <div class="arrow-container">
      <div class="actual-value-arrow" style:left={trackLeft(actualPosition)} title={String(actualValue)}></div>
    </div>
  {/if}

  <Slider bind:value {disabled} {min} {max} {step} {inputMapping} addHints={false} showValue={false} size="s" />
</div>

<style>
  .label-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    z-index: 3;
    pointer-events: none;
  }

  /* same look as the value indicator of noph's slider */
  .value-indicator {
    position: absolute;
    bottom: -6px;
    min-width: var(--np-slider-label-width, 48px);
    height: var(--np-slider-label-height, 44px);
    padding: 0 8px;
    box-sizing: border-box;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--np-color-inverse-surface);
    color: var(--np-color-inverse-on-surface);
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
    transition:
      opacity 0.2s cubic-bezier(0.2, 0, 0, 1),
      transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .value-indicator.visible {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

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
    border-top: 8px solid var(--np-color-primary);
    transform: translateX(-50%);
  }
</style>
