<script lang="ts">
  import * as d3 from 'd3';
  import type { IGraphConfig } from '#lib/interfaces/IGraphConfig.js';
  import { ui_state } from '#lib/state/ui.svelte.js';

  type DataPoint = [measurement: number, time: Date];

  let {
    config,
    title,
    unit = '',
    height = 200
  }: {
    config: IGraphConfig;
    title: string;
    unit?: string;
    height?: number;
  } = $props();

  const WINDOWS = [
    { label: '10 min', seconds: 600 },
    { label: '1h', seconds: 60*60 },
    { label: '10h', seconds: 60*60*10 }
  ];
  const margin = { top: 10, right: 12, bottom: 24, left: 52 };
  const timeFormat = d3.timeFormat('%H:%M:%S');

  let window_s = $state(300);
  let width = $state(0);
  let hover = $state<DataPoint | null>(null);

  const all: DataPoint[] = $derived(ui_state.rrc[config.system_name]?.sensor_values[config.id] ?? []);
  const end = $derived(all.length ? all[all.length - 1][1] : new Date());
  const data = $derived(all.filter((d) => d[1].getTime() >= end.getTime() - window_s * 1000));

  const innerWidth = $derived(Math.max(0, width - margin.left - margin.right));
  const innerHeight = $derived(height - margin.top - margin.bottom);

  const x = $derived(
    d3.scaleTime().domain([new Date(end.getTime() - window_s * 1000), end]).range([0, innerWidth])
  );
  const y = $derived.by(() => {
    const [low, high] = d3.extent(data, (d) => d[0]);
    return d3
      .scaleLinear()
      .domain([Math.min(config.dims[0], low ?? config.dims[0]), Math.max(config.dims[1], high ?? config.dims[1])])
      .nice()
      .range([innerHeight, 0]);
  });
  const path = $derived(
    d3.line<DataPoint>().x((d) => x(d[1])).y((d) => y(d[0]))(data) ?? ''
  );

  const bisect = d3.bisector((d: DataPoint) => d[1]);
  function onpointermove(event: PointerEvent) {
    const box = (event.currentTarget as SVGRectElement).getBoundingClientRect();
    hover = data[bisect.center(data, x.invert(event.clientX - box.left))] ?? null;
  }
</script>

<div class="graph">
  <div class="header">
    <span class="title">{title}{unit ? ` [${unit}]` : ''}</span>
    <span class="windows">
      {#each WINDOWS as w (w.seconds)}
        <button class:selected={window_s === w.seconds} onclick={() => (window_s = w.seconds)}>{w.label}</button>
      {/each}
    </span>
  </div>
  <div bind:clientWidth={width}>
    <svg {width} {height} role="img" aria-label="{title} graph">
      <g transform="translate({margin.left},{margin.top})">
        {#each y.ticks(5) as tick (tick)}
          <line class="grid" x1="0" x2={innerWidth} y1={y(tick)} y2={y(tick)} />
          <text class="label" x="-6" y={y(tick)} dy="0.32em" text-anchor="end">{tick}</text>
        {/each}
        {#each x.ticks(Math.max(2, Math.floor(innerWidth / 90))) as tick (tick.getTime())}
          <text class="label" x={x(tick)} y={innerHeight + 16} text-anchor="middle">{timeFormat(tick)}</text>
        {/each}
        <path d={path} fill="none" stroke={config.color} stroke-width="1.5" />
        {#if hover}
          <line class="cursor" x1={x(hover[1])} x2={x(hover[1])} y1="0" y2={innerHeight} />
          <circle cx={x(hover[1])} cy={y(hover[0])} r="4" fill={config.color} />
          <text class="readout" x={x(hover[1]) > innerWidth / 2 ? x(hover[1]) - 8 : x(hover[1]) + 8} y="12"
                text-anchor={x(hover[1]) > innerWidth / 2 ? 'end' : 'start'}>
            {hover[0].toFixed(2)} {unit} · {timeFormat(hover[1])}
          </text>
        {/if}
        <rect width={innerWidth} height={innerHeight} fill="transparent" role="presentation"
              {onpointermove} onpointerleave={() => (hover = null)} />
      </g>
    </svg>
  </div>
</div>

<style>
  .graph {
    border: 1px solid var(--np-color-outline-variant);
    border-radius: 12px;
    padding: 8px 8px 0;
    min-width: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 4px;
  }

  .title {
    font-weight: 500;
  }

  .windows button {
    border: 1px solid var(--np-color-outline-variant);
    background: none;
    color: var(--np-color-on-surface-variant);
    border-radius: 8px;
    padding: 2px 8px;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .windows button.selected {
    background-color: var(--np-color-secondary-container);
    color: var(--np-color-on-secondary-container);
  }

  svg {
    display: block;
    overflow: visible;
  }

  .grid {
    stroke: var(--np-color-outline-variant);
    stroke-width: 0.5;
  }

  .label {
    font-size: 0.7rem;
    fill: var(--np-color-on-surface-variant);
  }

  .cursor {
    stroke: var(--np-color-outline);
    stroke-dasharray: 3 3;
  }

  .readout {
    font-size: 0.75rem;
    fill: var(--np-color-on-surface);
  }
</style>
