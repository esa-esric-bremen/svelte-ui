<script lang="ts">
  import type { IGraphConfig } from '#lib/interfaces/IGraphConfig';
  import { ui_state } from '#lib/state/ui.svelte';
  import { Button } from 'noph-ui';
  import * as d3 from 'd3';

  export type DataPoint = [measurement: number, time: Date];

  const {
    config,
    margin = { top: 20, right: 30, bottom: 50, left: 60 }
  } = $props<{
    config: IGraphConfig;
    margin?: {
      top: number;
      right: number;
      bottom: number;
      left: number
    };
  }>();

  const timeFormat = d3.timeFormat("%H:%M:%S");

  let width = $state(0);
  let height = 300;

  let highlightedPointData = $state<{ point: DataPoint; xPos: number; yPos: number; } | null>(null);

  let svgRef: SVGSVGElement;
  let zoomTransform = $state(d3.zoomIdentity);

  const data: DataPoint[] = $derived(ui_state.rrc[config.system_name]?.sensor_values[config.id] ?? []);
  const innerWidth = $derived(width - margin.left - margin.right);
  const innerHeight = $derived(height - margin.top - margin.bottom);

  const bisectDate = d3.bisector<DataPoint, Date>((d) => d[1]).left;

  const clipId = `clip-${config.id}`;

  const chart = $derived.by(() => {
    if (!data || data.length < 2) return null;

    const yDomain = d3.extent(data, (d) => d[0]);
    const firstTime = d3.min(data, (d) => d[1]);
    const latestTime = d3.max(data, (d) => d[1]);

    if (!firstTime || !latestTime || yDomain[0] === undefined || yDomain[1] === undefined) {
      return null;
    }

    const x_base = d3.scaleTime().domain([firstTime, latestTime]).range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([config.dims[0], Math.max(yDomain[1], config.dims[1])])
      .range([innerHeight, 0]);

    const zx = zoomTransform.rescaleX(x_base);

    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => zx(d[1]))
      .y((d) => y(d[0]));

    return { x_base, y, zx, lineGenerator };
  });

  const zoomBehavior = $derived(d3
    .zoom<SVGSVGElement, unknown>()
    .extent([[0, 0],[innerWidth, innerHeight]])
    .scaleExtent([1, 20])
    .on('zoom', (event) => {
      if (event.sourceEvent && event.sourceEvent.type === 'wheel') {
        event.sourceEvent.preventDefault();
      }
      zoomTransform = event.transform;
    })
  );

  function resetZoom() {
    if (!svgRef || !chart) return;
    d3.select(svgRef).transition().duration(250).call(zoomBehavior.transform, d3.zoomIdentity);
  }

  $effect(() => {
    if (!svgRef) return;

    const svg = d3.select(svgRef);

    const chartGroup = svg.selectAll<SVGGElement>('.chart-content')
      .data([null])
      .join('g')
      .attr('class', 'chart-content')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const zoomRect = chartGroup.selectAll('.zoom-rect')
      .data([null])
      .join('rect')
      .attr('class', 'zoom-rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', (event) => {
        if (!chart) return;
        const [x] = d3.pointer(event);
        const timeAtCursor = chart.zx.invert(x);
        const index = bisectDate(data, timeAtCursor, 1);
        const p0 = data[index - 1];
        const p1 = data[index];
        if (!p0 || !p1) return;
        const point = timeAtCursor.getTime() - p0[1].getTime() > p1[1].getTime() - timeAtCursor.getTime() ? p1 : p0;
        const xPos = chart.zx(point[1]);
        const yPos = chart.y(point[0]);
        
        if (xPos < 0 || xPos > innerWidth) {
          highlightedPointData = null;
        } else {
          highlightedPointData = { point, xPos, yPos };
        }
      })
      .on('mouseleave', () => {
        highlightedPointData = null;
      });

    if (!chart) {
      chartGroup.selectAll('*').remove();
      zoomRect.on('.zoom', null);
      return;
    }

    zoomRect.call(zoomBehavior);

    drawAxes(chartGroup, { x: chart.zx, y: chart.y, innerHeight });
    drawLines(chartGroup, { data, lineGenerator: chart.lineGenerator });
    drawHighlight(chartGroup, highlightedPointData, innerHeight);
  });

  function drawAxes(
    group: d3.Selection<SVGGElement, null, SVGSVGElement, unknown>,
    scales: { x: d3.ScaleTime<number, number>; y: d3.ScaleLinear<number, number>; innerHeight: number; }
  ) {
    group.selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${scales.innerHeight})`)
      .call(d3.axisBottom(scales.x).ticks(width / 100).tickSizeOuter(0));

    group.selectAll('.y-axis').data([null]).join('g').attr('class', 'y-axis').call(d3.axisLeft(scales.y));
  }

  function drawLines(
    group: d3.Selection<SVGGElement, null, SVGSVGElement, unknown>,
    chartElements: { data: DataPoint[]; lineGenerator: d3.Line<DataPoint> }
  ) {

    group.selectAll('.line-path')
      .data([chartElements.data])
      .join('path')
      .attr('class', 'line-path')
      .attr('clip-path', `url(#${clipId})`)
      .attr('d', chartElements.lineGenerator)
      .style('stroke', config.color);
  }

  function drawHighlight(group: d3.Selection<SVGGElement, unknown, null, undefined>, pointData: typeof highlightedPointData, innerHeight: number) {
    const highlightGroup = group.selectAll<SVGGElement, typeof pointData>('.highlight-overlay').data(pointData ? [pointData] : []);
    
    highlightGroup.exit().remove();
    
    const enterGroup = highlightGroup
      .enter()
      .append('g')
      .attr('class', 'highlight-overlay')
      .style('pointer-events', 'none');
    enterGroup
      .append('line')
      .attr('class', 'crosshair-line');
    enterGroup
      .append('circle')
      .attr('class', 'highlight-circle')
      .attr('r', 4);
    
    const tooltip = enterGroup
      .append('g')
      .attr('class', 'tooltip');
    tooltip
      .append('rect')
      .attr('class', 'tooltip-bg');
    tooltip
      .append('text')
      .attr('class', 'tooltip-text');

    const updateGroup = enterGroup.merge(highlightGroup);
    updateGroup.select('.crosshair-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('x1', d => d.xPos)
      .attr('x2', d => d.xPos);
    updateGroup.select('.highlight-circle')
      .attr('cx', d => d.xPos)
      .attr('cy', d => d.yPos)
      .style('fill', config.color);
    
    updateGroup.select('.tooltip')
      .attr('transform', d => {
        const xOffset = d.xPos > innerWidth / 2 ? -75 : 15;
        return `translate(${d.xPos + xOffset}, ${d.yPos - 10})`;
      });

    updateGroup.select('.tooltip-text')
      .text(null) // Clear existing text
      .each(function(d) {
        const text = d3.select(this);
        // First line of text
        text.append('tspan')
          .attr('x', 0)
          .text(`${d.point[0].toFixed(2)}`);
        // Second line of text
        text.append('tspan')
          .attr('x', 0)
          .attr('dy', '1.2em') // relative offset
          .text(timeFormat(d.point[1]));
      })
      .attr('x', 5)
      .attr('y', 15);
      
    updateGroup.select('.tooltip-bg').attr('width', 70).attr('height', 40).attr('rx', 3);
  }
</script>

<div class="chart-container" bind:clientWidth={width}>
  <svg bind:this={svgRef} {width} {height}>
    <defs>
      <clipPath id={clipId}>
        <rect width={innerWidth} height={innerHeight}></rect>
      </clipPath>
    </defs>
  </svg>
  <Button variant="text" onclick={resetZoom}>Reset</Button>
</div>

<style>
  :global(.line-path) {
    fill: none;
    stroke-width: 1px;
  }
  :global(.x-axis .domain),
  :global(.y-axis .domain) {
    stroke: #999;
  }
  :global(.tick text) {
    font-size: 0.75rem;
    fill: #aaa;
  }
  :global(.tooltip-bg) {
    fill: rgba(20, 20, 20, 0.75);
  }
  :global(.tooltip-text) {
    font-size: 12px; font-family: sans-serif; fill: white;
  }
</style>
