<script lang="ts">
  let {
    speed = $bindable(0),
    distance = $bindable(0),
    speedDividerChain = 1,
    dividerLinearActuatorDistance = 1,
    startSpeedLinearActuator = 150
  } = $props();

  // --- Configuration ---
  const numberOfLinks: number = 70;
  const numberOfShovels: number = numberOfLinks/5;
  const baseCycleDuration: number = 10000;
  const TRANSLATION_ANGLE_DEGREES: number = 60;
  const TRANSLATION_ANGLE_RADIANS = TRANSLATION_ANGLE_DEGREES * (Math.PI / 180);

  const customPathData = "M 1071.8901,343.82406 C 1055.493,316.26344 918.93322,80.255044 901.08566,49.215922 883.23809,18.1768 841.19278,40.694659 859.83112,72.376356 878.46947,104.05805 1011.7473,336.37938 1028.468,364.77684 c 16.7208,28.39747 59.8191,6.60782 43.4221,-20.95278 z";


  const translateX = $derived(distance / dividerLinearActuatorDistance * Math.cos(TRANSLATION_ANGLE_RADIANS));
  const translateY = $derived(distance / dividerLinearActuatorDistance * Math.sin(TRANSLATION_ANGLE_RADIANS));
  
    let chainContainer: SVGGElement | undefined = $state();
    let shovelContainer: SVGGElement | undefined = $state();
  
  $effect(() => {
    if (!chainContainer || !shovelContainer) return;
    const shovelLinkElements = Array.from(shovelContainer.children) as HTMLElement[];
    const chainLinkElements = Array.from(chainContainer.children) as HTMLElement[];
    const staggerOffsetLinks = 1.0 / numberOfLinks;
    const staggerOffsetShovels = 1.0 / numberOfShovels;
    let animationProgress = 0.0;
    let lastTimestamp = performance.now();
    let animationFrameId: number;

    const animationLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      const progressDelta = (deltaTime / baseCycleDuration) * -(speed - startSpeedLinearActuator) / speedDividerChain;
      animationProgress += progressDelta;
      animationProgress = ((animationProgress % 1.0) + 1.0) % 1.0;

      for (let i = 0; i < chainLinkElements.length; i++) {
        const element = chainLinkElements[i];
        const linkBaseOffset = i * staggerOffsetLinks;
        const currentLinkProgress = (animationProgress + linkBaseOffset) % 1.0;
        element.style.offsetDistance = `${currentLinkProgress * 100}%`;
      }

      for (let i = 0; i < shovelLinkElements.length; i++) {
        const element = shovelLinkElements[i];
        const linkBaseOffset = i * staggerOffsetShovels;
        const currentLinkProgress = (animationProgress + linkBaseOffset) % 1.0;
        element.style.offsetDistance = `${currentLinkProgress * 100 + .85}%`;
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationFrameId = requestAnimationFrame(animationLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  });

  const chainLinks: number[] = new Array(numberOfLinks).fill(0);
  const shovelLinks: number[] = new Array(numberOfShovels).fill(0);
</script>

<div
 style="--motion-path: path('{customPathData}');"
>
<div style="transform: translateX({translateX}px) translateY({translateY}px);">
<div style:position="absolute" style:top="0px" style:left="0px;">
  <img
    src="/coyote_src_excavator_background.png"
    alt="Coyote excavation background" />
</div>
<svg width="100%" height="100%" viewBox="0 0 1200 500">
  <g class="transform-group" >
    <defs>
      <g id="chain-link-shape">
        <path
          transform="translate(-0.5 -0), scale(0.25)"
          style="fill:#ffffff;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
          d="m 53.342918,31.605859 -0.0087,-18.026823 C 53.214653,-1.5176269 34.250032,-0.19234068 32.40458,8.5210815 30.749231,12.503662 24.192487,11.972275 22.142615,8.4796821 19.423556,-1.3315893 2.1025378,-0.76743352 1.8332137,13.414012 l -0.00129,18.134421 z"
        />
      </g>
      <g id="shovel-link-shape"
        transform="translate(-25 -35), scale(0.25)">
        <rect
          style="fill:#b5b8cd;fill-opacity:1;stroke:#000000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
          id="rect8"
          width="10.355372"
          height="24.257839"
          x="-148.97794"
          y="-172.50172"
          transform="scale(-1)" />
        <path
          style="fill:#7e7d7c;fill-opacity:1;stroke:#000000;stroke-width:1.6105;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
          d="m 172.51181,177.23578 -56.63715,0.1635 c -7.45875,0.3525 -15.6126,8.4588 -11.6265,17.3076 l 37.38975,22.3281 z"
        />
      </g>
    </defs>
    <path 
      d={customPathData} 
      fill="none" 
    />
    <g bind:this={chainContainer}>
      {#each chainLinks as _}
        <use href="#chain-link-shape" class="link" />
      {/each}
    </g>
    <g bind:this={shovelContainer}>
      {#each shovelLinks as _}
        <use href="#shovel-link-shape" class="link" />
      {/each}
    </g>
  </g>
</svg>
</div>
</div>

<style>
  .transform-group {
    transition: transform 0.1s ease-out;
  }

  .link {
    offset-path: var(--motion-path);
    offset-rotate: auto;
  }

</style>