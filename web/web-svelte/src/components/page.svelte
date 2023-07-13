<script>
  import "../styles/app.css";
  import "../styles/fonts.css";
  import Footer from "./footer.svelte";
  import favicon32 from "../assets/favicons/favicon-32x32.png";
  import favicon16 from "../assets/favicons/favicon-16x16.png";
  import faviconApple from "../assets/favicons/apple-touch-icon.png";

  let topRight1, topRight2, pageY, ring, documentEl;

  let opacityLogo;

  export let home;

</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="{faviconApple}">
  <link rel="icon" type="image/png" sizes="32x32" href="{favicon32}">
  <link rel="icon" type="image/png" sizes="16x16" href="{favicon16}">
</svelte:head>

<div class="h-0">
  <!-- <img src="./assets/topright.svg" class="absolute top-0 right-0 w-80 md:w-96 lg:w-124">
  <img src="./assets/bottomleft.svg" class="absolute bottom-0 left-0 w-80 md:w-96 lg:w-124"> -->
  <!--  <BreathingAnim/>-->

  <!--  <img src="../assets/topright.svg" class="fixed top-0 right-0 w-96 lg:w-124 below2" alt="Top-right background image" />-->
  <img src="../assets/bottomleft.svg" class="fixed bottomHack left-0 w-96 lg:w-124 below2"
       alt="Bottom-left background image" />

  <!--  345 344-->
  <svg class="fixed top-0 right-0 w-96 lg:w-124 below2" bind:this={topRight2} viewBox="0 20 550 510" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0" id="a1"
      d="M547.461 510C477.611 495.92 407.964 482.027 344.39 456.87C281.019 431.713 223.924 395.292 170.879 351.549C118.036 307.618 69.4449 256.177 41.7074 196.664C13.7675 137.151 6.88375 69.7527 0 2.35445H547.461V510Z"
      fill="#EEF4FA" />
    <path
      opacity="0" id="a2"
      d="M550 410.531C493.676 399.195 437.135 387.858 385.832 367.413C334.53 347.17 288.248 317.817 245.46 282.392C202.671 246.764 163.376 205.265 140.89 157.087C118.404 109.11 112.947 54.454 107.271 0H550V410.531Z"
      fill="#D6E9FB" />
    <path
      opacity="0" id="a3"
      d="M547.461 322.245C503.25 313.426 458.782 304.369 418.684 288.399C378.328 272.43 342.086 249.549 308.413 221.662C274.998 193.776 243.896 161.122 226.417 123.225C208.682 85.5664 204.312 42.9024 199.942 4.03627e-06H547.461V322.245Z"
      fill="#BEDFFD" />
    <path
      opacity="0" id="a4"
      d="M548.094 198.939C520.8 193.495 493.348 187.903 468.593 178.044C443.68 168.186 421.305 154.06 400.518 136.844C379.889 119.628 360.688 99.4697 349.897 76.0739C338.948 52.8252 336.25 26.4865 333.553 0.000645665H548.094V198.939Z"
      fill="#A3D4FE" />
    <path
      opacity="0" id="a5"
      d="M548.094 99.4697C534.447 96.674 520.8 94.0254 508.264 89.0225C495.887 84.1668 484.62 76.9568 474.306 68.4224C463.991 59.741 454.47 49.7352 448.916 38.1109C443.521 26.4865 442.252 13.2436 440.823 0.000656891L548.094 0.000645665L548.094 99.4697Z"
      fill="#95CFFF" />

  </svg>

  <svg class="fixed top-0 right-0 w-96 lg:w-124 below2" bind:this={topRight1} viewBox="0 20 550 510" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path
      id="b1"
      d="M549.989 510C472.27 507.575 394.696 505.285 339.494 471.204C284.437 437.124 251.752 371.252 201.779 322.892C151.806 274.532 84.5467 243.685 48.0841 192.765C11.4763 141.846 5.81077 70.9905 0 0H549.989V510Z"
      fill="#EEF4FA" />
    <path
      id="b2"
      d="M549.992 408.027C487.817 406.141 425.787 404.255 381.625 376.91C337.463 349.699 311.315 297.028 271.366 258.368C231.417 219.707 177.667 194.921 148.468 154.239C119.269 113.558 114.62 56.7116 109.972 0H549.992V408.027Z"
      fill="#D6E9FB" />
    <path
      id="b3"
      d="M549.994 305.919C503.363 304.572 456.877 303.09 423.755 282.75C390.634 262.274 371.023 222.805 341.097 193.708C311.026 164.746 270.787 146.157 248.851 115.713C226.916 85.1347 223.429 42.5674 220.088 0H549.994V305.919Z"
      fill="#BEDFFD" />
    <path
      id="b4"
      d="M550 203.946C518.912 203.003 487.825 202.06 465.744 188.455C443.808 174.849 430.734 148.447 410.687 129.184C390.785 109.786 363.765 97.5277 349.238 77.0523C334.566 56.7115 332.387 28.4231 330.062 0H550V203.946Z"
      fill="#A3D4FE" />
    <path
      id="b5"
      d="M549.986 101.973C534.442 101.569 518.899 101.03 507.858 94.2947C496.818 87.4247 490.281 74.2234 480.402 64.5245C470.379 54.9604 456.869 48.7638 449.605 38.5261C442.342 28.4231 441.18 14.1442 440.018 0H549.986V101.973Z"
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
