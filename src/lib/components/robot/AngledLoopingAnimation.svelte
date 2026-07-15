<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    backgroundImage: string;
    angle?: number;
    patternDistance: number;
    speed?: number;
    startSpeed?: Number
    scale?: number;
    speedDivider?: number
  };

  let {
    backgroundImage,
    angle = 15,
    patternDistance,
    speed = $bindable(1),
    scale = 1,
    startSpeed = 0,
    speedDivider = 1
  }: Props = $props();

  let position = $state(0);
  let animationFrameId: number;
  let lastTimestamp = $state(0);

  const loopingdistance = patternDistance * scale;

  const angleInRadians = $derived(angle * (Math.PI / 180));
  const cosAngle = $derived(Math.cos(angleInRadians));
  const sinAngle = $derived(Math.sin(angleInRadians));

  const transformX = $derived(position * cosAngle);
  const transformY = $derived(position * sinAngle);

  const imageTransform = $derived(`translate(-50%, -50%) rotate(${angle}deg)`);

  const animate = (timestamp: number) => {
    if (lastTimestamp === 0) {
      lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    position += ((speed - (startSpeed || 0)) / 60 / speedDivider) * deltaTime;
    
    if (loopingdistance > 0) {
      position = ((position % loopingdistance) + loopingdistance) % loopingdistance;
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  onMount(() => {
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  });
</script>

<div class="animation-wrapper">
  <div
    class="animation-container"
    style="transform: translate({-transformX}px, {-transformY}px);"
  >
    <img
      src={backgroundImage}
      alt="Looping background"
      style="transform: {imageTransform};"
    />
  </div>
</div>

<style>
  .animation-wrapper {
    position: relative;
    inset: 0;
    left: 0px;
    top: 0px;
    z-index: 0;
  }
  .animation-container {
    position: relative;
    left: 679px;
    top: 199px;
  }
  img {
    position: absolute;
    transform-origin: center;
  }
</style>