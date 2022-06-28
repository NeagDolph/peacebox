<script>
  import "../app.css";
  import "../assets/fonts.css";
  import Footer from "./footer.svelte";
  import favicon32 from "../assets/favicons/favicon-32x32.png";
  import favicon16 from "../assets/favicons/favicon-16x16.png";
  import faviconApple from "../assets/favicons/apple-touch-icon.png";

  export let home;
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="{faviconApple}">
  <link rel="icon" type="image/png" sizes="32x32" href="{favicon32}">
  <link rel="icon" type="image/png" sizes="16x16" href="{favicon16}">
</svelte:head>

<div>
  <!-- <img src="./assets/topright.svg" class="absolute top-0 right-0 w-80 md:w-96 lg:w-124">
  <img src="./assets/bottomleft.svg" class="absolute bottom-0 left-0 w-80 md:w-96 lg:w-124"> -->

  <img src="../assets/topright.svg" class="fixed top-0 right-0 w-96 lg:w-124 below2" alt="Top-right background image" />
  <img src="../assets/bottomleft.svg" class="fixed bottomHack left-0 w-96 lg:w-124 below2"
       alt="Bottom-left background image" />

</div>
<div class="siteWrapper">
  <div
    class="flex flex-row h-28 items-center sm:pl-8 lg:pl-16 border-b border-gray-900 justify-between header w-full">
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
      <div class="h-full px-4 sm:px-8 hidden sm:flex border-l border-gray-900 items-center">
        <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
          <div class="border-2 rounded-sm border-gray-900 px-2 sm:px-3 py-1">
            <p class="font-baloo2 text-lg whitespace-nowrap"><i class="fa-solid fa-cloud-arrow-down"></i> &nbsp;Download
            </p>
          </div>
        </a>
      </div>
      <div class="h-full pr-8 pl-4 block sm:hidden border-gray-900 flex items-center">
        <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
          <i class="fa-solid fa-cloud-arrow-down fa-2x"></i>
        </a>
      </div>
    </div>
  </div>
  <slot></slot>
  <Footer />
</div>
