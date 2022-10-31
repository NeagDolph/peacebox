<script>
  import { onMount } from "svelte";
  import _ from "lodash";
  import { logoActive } from "../stores/store.js";

  let topRight1, topRight2, Snap, pageY, ring, animElement, innerWidth, innerHeight;

  let set1, set2, setRing, opacityLogo, setAll;

  let logoActiveVal;

  logoActive.subscribe((val) => logoActiveVal = val);

  onMount(async () => {
    Snap = (await import("snapsvg-cjs")).default;

    // set1 = Snap(topRight1).selectAll("path");
    // set2 = Snap(topRight2).selectAll("path");

    setRing = Array.from(Snap(ring).selectAll("circle"));
    setAll = setRing.concat(Array.from(Snap(ring).selectAll("ellipse")));

    // console.log(setRing);

    initAnim();

  });

  let initAnim = () => {
    setRing?.forEach(el => {
      el.animate({ opacity: 0 }, 1, Snap.linear);
    });
  };

  let scrollLoop = () => {
    if (innerWidth >= 768) {
      logoToCircle();

      openCircle();

      // const logoTop = animElement?.getBoundingClientRect()?.top;
      // const logoHeight = animElement?.getBoundingClientRect()?.height;
      // if (-logoTop > 0) {
      // }

    }
  };

  let logoToCircle = () => {

  };

  let openCircle = () => {
    _.debounce(() => {
      setRing?.forEach(el => {

        const logoRect = animElement.getBoundingClientRect();
        const pageCalc = -(innerHeight * 0.75) - (logoRect.top - innerWidth);

        const scrollFactor = Math.min(Math.max(0, pageCalc / 10), 40);

        const opacityFactor = Math.min(Math.max((scrollFactor - 10) / 10, 0), 0.8);

        const angleInDegrees = (Number(el.node.id) - 1) * 36;
        const angleInRadians = ((angleInDegrees * Math.PI) / 180);
        const cos = 100 + (scrollFactor * Math.cos(angleInRadians));
        const sin = 100 + (scrollFactor * Math.sin(angleInRadians));


        if (animElement.top < 0) {
          if (logoActiveVal === 1) {
            logoActive.update(() => 2);

            setTimeout(() => logoActive.update(() => 3), 10);
          }
        }

        if (animElement.top > 20) {
          if (logoActiveVal >= 3) {
            logoActive.update(() => 0);
            setTimeout(() => logoActive.update(() => 1), 200);

          }
        }

        if (el.node.id === "main") {
          el.animate({ opacity: opacityFactor }, 60, mina.linear);

        } else el.animate({ cx: cos, cy: sin, opacity: opacityFactor }, 60, mina.linear);
      });
    }, 50)();

  };
</script>

<svelte:window bind:scrollY={pageY} on:scroll={scrollLoop} bind:innerWidth={innerWidth}
               bind:innerHeight={innerHeight} />

<style>
    @-webkit-keyframes rotating /* Safari and Chrome */
    {
        from {
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes rotating {
        from {
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        to {
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .rotating {
        -webkit-animation: rotating 5s linear infinite;
        -moz-animation: rotating 2s linear infinite;
        -ms-animation: rotating 2s linear infinite;
        -o-animation: rotating 2s linear infinite;
        animation: rotating 20s linear infinite;
    }

    #rotateDiv {
        /*left: calc(14vw + 20px);*/
        /*top: 1350px;*/
        /*width: 200px !important;*/
        /*height: 200px;*/
        /*position: absolute !important;*/
    }
</style>

<div bind:this={animElement} id="rotateDiv" class="relative h-32 w-32 w-full items-center opacity-70">
  <div class="w-32 h-32 flex justify-center items-center">
    <div bind:this={opacityLogo} class="absolute top-0 h-32 w-32 flex justify-center items-center verticalHack">
    </div>
    <svg viewBox="0 0 200 200" class="w-32 h-32 rotating"

         fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="closed" bind:this={ring}>
        <circle id="10" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="9" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="8" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="7" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="6" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="5" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="4" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="3" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle id="2" cx="100" cy="100" r="50" fill="#6062FF"
                style="opacity: 0" fill-opacity="0.37" />
        <circle style="opacity: 0" id="1" cx="100" cy="100" r="50" fill="#6062FF" fill-opacity="0.37" />
        <circle style="opacity: 0" id="main" cx="100" cy="100" r="50" fill="#6062FF" fill-opacity="0.8" />
      </g>
    </svg>
  </div>
</div>
