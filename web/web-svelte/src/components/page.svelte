<script>
  import "../styles/app.css";
  import "../styles/fonts.css";
  import Footer from "./footer.svelte";
  import favicon32 from "../assets/favicons/favicon-32x32.png";
  import favicon16 from "../assets/favicons/favicon-16x16.png";
  import faviconApple from "../assets/favicons/apple-touch-icon.png";
  import gsap from "gsap/dist/gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { onMount } from "svelte";

  let topRight1, topRight2, pageY, ring, documentEl;

  let opacityLogo;

  export let home;

  const animationDuration = 0.9;
  const animationOffset = 0.3;


  const pageHeight = window.innerHeight;
  const pageWidth = window.innerWidth;


  const scales = [0, 7, 7, 9, 14, 30];


  function registerBackgroundObjectA(tl, number) {
    tl.fromTo("#a" + number, {
      duration: animationDuration,
      scale: 1,
      y: 0,
      rotation: 0,
      ease: "sine.inOut"
    }, {
      duration: animationDuration,
      scale: scales[number],
      y: -pageHeight * 1.1,
      rotation: 15,
      ease: "sine.inOut"
    });
  }

  function registerBackgroundObjectB(tl, number) {
    tl.fromTo("#b" + number, {
      duration: animationDuration,
      scale: 1,
      rotation: 0,
      x: 0,
      ease: "sine.inOut"
    }, {
      duration: animationDuration,
      scale: scales[number],
      rotation: -15,
      x: -pageWidth * 0.9,
      ease: "sine.inOut"
    });
  }

  function registerBackgroundTriggerTimeline(number) {
    const breakpointLength = (window.document.body.scrollHeight - window.innerHeight) / 10;

    const start = ((number * breakpointLength) + 100) + "px";
    const end = "+=" + (breakpointLength * 3) + "px";

    const tl = gsap.timeline({
      scrollTrigger: {
        start,
        end: end,
        scrub: 1,
        preventOverlaps: false
      }
    });

    return tl;
  }

  function registerBackgroundTrigger(number) {
    const tlA = registerBackgroundTriggerTimeline(number);
    const tlB = registerBackgroundTriggerTimeline(number);

    registerBackgroundObjectA(tlA, number);
    registerBackgroundObjectB(tlB, number);
  }


  function calcBoxOffsets(endSize) {
    let boxRect = document.querySelector("#boxCanvas > div").getBoundingClientRect();
    let differenceX = (window.innerWidth - boxRect.x) - ((boxRect.width * endSize * 1.7));
    let differenceY = ((400) - (400 * endSize)) / 2;

    return { differenceX, differenceY };
  }

  function createLogoScroll() {
    const END_SIZE = 0.4;
    let { differenceX, differenceY } = calcBoxOffsets(END_SIZE);

    const mobile = window.innerWidth < 768;

    if (mobile) return;

    const startTrigger = "top+=15px top";

    // First ScrollTrigger for the animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#boxTrigger",
        start: startTrigger,
        end: () => "+=" + window.innerHeight / 3,  // adjust this value according to your needs
        markers: false,
        scrub: 0,
        preventOverlaps: false
      }
    }).to("#boxCanvas", { scale: END_SIZE, duration: 1, x: differenceX, y: -differenceY, opacity: 0.8 });

    // Second ScrollTrigger for the pinning
    gsap.to("#boxTrigger", {
      scrollTrigger: {
        trigger: "#boxTrigger",
        start: startTrigger,
        endTrigger: "#section2Card",
        end: "top top+=140px",
        pin: true,
        pinSpacing: false
      }
    });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    // setTimeout(createLogoScroll, 1000);
    createLogoScroll();
    // registerBackgroundTrigger(1);
    // registerBackgroundTrigger(2);
    // registerBackgroundTrigger(3);
    // registerBackgroundTrigger(4);
    // registerBackgroundTrigger(5);

    // registerTriggers("top bottom", "#section2", () => expandBackgroundObject(1), () => collapseBackgroundObject(1));
    // registerTriggers("top center", "#section2", () => expandBackgroundObject(2), () => collapseBackgroundObject(2));
    // registerTriggers("top top", "#section2", () => expandBackgroundObject(3), () => collapseBackgroundObject(3));
    // registerTriggers("40%", () => expandBackgroundObject(4), () => collapseBackgroundObject(4));
    // registerTriggers(1600, () => expandBackgroundObject(5), () => collapseBackgroundObject(5));
  });

  $: viewboxHeight = window.innerHeight;
  $: viewboxWidth = window.innerWidth;

</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="{faviconApple}">
  <link rel="icon" type="image/png" sizes="32x32" href="{favicon32}">
  <link rel="icon" type="image/png" sizes="16x16" href="{favicon16}">
  <meta name="apple-itunes-app" content="app-id=1592436336">
</svelte:head>


<div class="h-0">
  <!-- <img src="./assets/topright.svg" class="absolute top-0 right-0 w-80 md:w-96 lg:w-124">
  <img src="./assets/bottomleft.svg" class="absolute bottom-0 left-0 w-80 md:w-96 lg:w-124"> -->
  <!--  <BreathingAnim/>-->

  <!--  <img src="../assets/topright.svg" class="fixed top-0 right-0 w-96 lg:w-124 below2" alt="Top-right background image" />-->
  <!--  <img src="../assets/bottomleft.svg" class="fixed bottomHack left-0 w-96 lg:w-124 below2"-->
  <!--       alt="Bottom-left background image" />-->

  <!--  345 344-->
  <svg class="fixed bottom-0 left-0 below2" bind:this={topRight2} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">

    <path id="a1"
          d="M0 1144C33.7449 1163.62 67.41 1183.25 102.91 1196.62C138.33 1209.91 175.585 1216.87 207.017 1237.12C238.448 1257.29 264.136 1290.75 279.053 1326.71C293.892 1362.75 297.96 1401.38 302.029 1440H0V1144Z"
          fill="#EEF4FA" />
  </svg>

  <svg class="fixed top-0 right-0 below2" bind:this={topRight1} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="b1"
          d="M2560 328C2510 328 2460.13 328 2428.33 303.012C2396.65 278.145 2383.17 228.29 2354.03 196.388C2324.9 164.485 2279.99 150.414 2254.42 120.695C2228.85 90.9763 2222.36 45.4882 2216 0H2560V328Z"
          fill="#EEF4FA" />
  </svg>

  <svg class="fixed bottom-0 left-0 below2" bind:this={topRight2} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">

    <path id="a2"
          d="M0 1203.18C26.964 1218.9 53.928 1234.61 82.328 1245.25C110.648 1255.88 140.484 1261.51 165.613 1277.69C190.742 1293.88 211.324 1320.54 223.211 1349.39C235.097 1378.16 238.368 1409.12 241.639 1440H0V1203.18Z"
          fill="#D6E9FB" />
  </svg>

  <svg class="fixed top-0 right-0 below2" bind:this={topRight1} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="b2"
          d="M2560 263.163C2519.85 263.163 2479.84 263.163 2454.39 243.179C2428.94 223.195 2418.05 183.228 2394.78 157.534C2371.37 131.971 2335.31 120.681 2314.76 96.8045C2294.21 72.9278 2289.17 36.4639 2284 0H2560V263.163Z"
          fill="#D6E9FB" />
  </svg>

  <svg class="fixed bottom-0 left-0 below2" bind:this={topRight2} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="a3"
          d="M0 1262.45C20.2629 1274.17 40.446 1285.98 61.746 1293.95C83.0459 1301.93 105.303 1306.15 124.21 1318.27C143.117 1330.39 158.513 1350.4 167.448 1372.06C176.303 1393.64 178.776 1416.86 181.169 1440H0V1262.45Z"
          fill="#BEDFFD" />
  </svg>

  <svg class="fixed top-0 right-0 below2" bind:this={topRight1} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="b3"
          d="M2560 196.419C2530.14 196.419 2500.12 196.419 2481.23 181.455C2462.18 166.491 2454.11 136.709 2436.58 117.677C2419.21 98.4999 2392.4 90.0736 2377.01 72.2042C2361.62 54.48 2357.81 27.1674 2354 0H2560V196.419Z"
          fill="#BEDFFD" />
  </svg>

  <svg class="fixed bottom-0 left-0 below2" bind:this={topRight2} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="a4"
          d="M0 1321.63C13.482 1329.45 26.964 1337.27 41.164 1342.66C55.3639 1347.98 70.2021 1350.79 82.8066 1358.85C95.411 1366.9 105.702 1380.27 111.605 1394.65C117.589 1409.12 119.184 1424.52 120.78 1440H0V1321.63Z"
          fill="#A3D4FE" />
  </svg>

  <svg class="fixed top-0 right-0 below2" bind:this={topRight1} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="b4"
          d="M2560 128.912C2540.4 128.912 2520.7 128.912 2508.3 119.091C2495.8 109.27 2490.5 89.7233 2479 77.2326C2467.6 64.6465 2450 59.1163 2439.9 47.3884C2429.8 35.7558 2427.3 17.8302 2424.8 0H2560V128.912Z"
          fill="#A3D4FE" />
  </svg>

  <svg class="fixed bottom-0 left-0 below2" bind:this={topRight2} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="a5"
          d="M0 1380.82C6.78088 1384.72 13.482 1388.63 20.582 1391.29C27.682 1393.95 35.101 1395.36 41.4033 1399.42C47.7055 1403.49 52.8111 1410.13 55.8426 1417.33C58.7943 1424.52 59.592 1432.26 60.3898 1440H0V1380.82Z"
          fill="#95CFFF" />
  </svg>

  <svg class="fixed top-0 right-0 below2" bind:this={topRight1} width="2560px" height="1440px" viewBox="0 0 2560 1440"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path id="b5"
          d="M2560 64.4558C2550.2 64.4558 2540.4 64.4558 2534.1 59.593C2527.9 54.6349 2525.2 44.9093 2519.5 38.6163C2513.8 32.3233 2505 29.5581 2499.9 23.7419C2494.9 17.8302 2493.7 8.96279 2492.4 0H2560V64.4558Z"
          fill="#95CFFF" />
  </svg>


</div>
<div class="siteWrapper" bind:this={documentEl}>
  <div
    class="hidden flex flex-row h-28 items-center sm:pl-8 lg:pl-16 border-b border-gray-900 justify-between header w-full">
    <div class="flex flex-row">

      {#if home === "true"}
        <p class="text-black font-futura font-bold tracking-tight text-5xl hidden sm:block">PeaceBox</p>
      {:else}
        <a href="/"><p class="text-black font-futura font-bold tracking-tight text-5xl hidden sm:block">PeaceBox</p></a>
      {/if}

      <div class="max-w-28 min-w-24 pr-3 sm:hidden">
        <p class="text-black font-futura font-bold tracking-tight text-7xl pl-4">P</p>
      </div>
    </div>
    <div class="flex flex-row h-full items-center">
      <div class="mr-4 md:mr-8 lg:mr-12 py-2">
        <a href="mailto:contact@peacebox.app" target="_blank">
          <p class="font-baloo2 text-md whitespace-nowrap"><i class="fa-solid fa-envelope fa-md"></i> &nbsp;Email</p>
        </a>
      </div>
      <div class="mr-6 md:mr-10 lg:mr-14 py-2 hidden sm:block">
        <a href="https://github.com/neagdolph/peacebox" target="_blank">
          <p class="font-baloo2 text-md"><i class="fa-brands fa-github fa-md"></i> &nbsp;Github</p>
        </a>
      </div>
      <!--      <div class="h-full px-4 sm:px-8 hidden sm:flex border-l border-gray-900 items-center">-->
      <!--        <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">-->
      <!--          <div class="border-2 rounded-sm border-gray-900 px-2 sm:px-3 py-1">-->
      <!--            <p class="font-baloo2 text-lg whitespace-nowrap"><i class="fa-solid fa-cloud-arrow-down"></i> &nbsp;Download-->
      <!--            </p>-->
      <!--          </div>-->
      <!--        </a>-->
      <!--      </div>-->
      <div class="h-full pr-8 pl-4 block sm:hidden border-gray-900 flex items-center">
        <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"
           aria-label="Visit PeaceBox on the Appstore">
          <i class="fa-solid fa-cloud-arrow-down fa-2x"></i>
        </a>
      </div>
    </div>
  </div>
  <slot></slot>
  <Footer />
</div>
