<script>
  import "../styles/app.css";
  import "../styles/fonts.css";

  import Page from "../components/page.svelte";
  import GithubButton from "../components/github_button.svelte";
  import LogoAnim from "../components/logo_anim.svelte";
  import { onMount } from "svelte";
  import { logoActive } from "../stores/store.js";
  import Game from "../components/game.svelte";

  let logoActiveVal;

  logoActive.subscribe(value => {
    logoActiveVal = value;
  });

  // import "snapsvg-cjs"

  let shareApp = () => {
    if (navigator.share) {
      // Web Share API is supported
      navigator.share({
        title: "PeaceBox",
        text: "The PeaceBox App on iOS",
        url: "https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"
      }).then(() => {
        console.log("Thanks for sharing!");
      });
    } else {
      // Fallback
    }
  };

  onMount(() => {
    logoActive.update(() => 1);
    setTimeout(() => {
      logoActive.update(() => 2);
    }, 1800);
  });
</script>

<Page home="true">

  <!-- Hi, I'm PeaceBox - Section 1 -->
  <div class="mainContainer">
    <div
      class="sm:px-8 lg:px-16 flex flex-row justify-between items-center justify-center w-full h-full innerContainer">
      <div
        class="justify-center flex w-full basis-full md:basis-2/3 lg:basis-3/5 sm:mr-10 px-4 lg:px-0">
        <div class="container w-fit max-w-xl z-10">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-vollkorn font-light text-primary">Hi, I'm PeaceBox</p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            We all deal with stress and anxiety in our lives but most of us don't know how to effectively let go of it.
          </p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mb-10 text-primary mt-6 sm:mt-0 sm:pl-1.5">
            PeaceBox is like a toolbox for your mind with the tools and techniques you need to relax and de-stress.
          </p>
          <div class="flex flex-row items-center justify-start">

            <!--            <ShareModal />-->
            <a href=" https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
              <img src="../assets/appstore.svg" class="w-44 borderAppStore min-w-32">
            </a>
            <div class="mx-4 sm:mx-16">
              <GithubButton />
            </div>

          </div>

        </div>
      </div>
      <div
        class="items-center -translate-y-3 md:-translate-y-0 md:mt-10 w-full flex fixed opacity-30 md:opacity-100 md:relative basis-1/3 lg:basis-2/5">
        <div
          class="w-40 w-40 md:w-full md:h-full lg:h-72 lg:w-72 rounded-5xl lg:rounded-6xl logoMain opacityLogo logoContainer">
          <!--          <img src="../assets/logo-transparent-white-blue.png" />-->

          <!--          <LogoAnim active={logoActiveVal} />-->

          <!--          <Game />-->
          {#if logoActiveVal <= 1}
            <LogoAnim active={logoActiveVal} />
          {/if}
          <div
            style="width: 350px; height: 350px"
            class="absolute block justify-center items-center"
            class:opacity-0={logoActiveVal <= 1}
            class:relative={logoActiveVal >= 2}
          >
            <Game />
          </div>
          <!--{:else}-->
          <!--  <Game />-->
          <!--{/if}-->
        </div>
      </div>
    </div>
  </div>

  <!-- Dont Pay for Peace - Section 2 -->
  <div class="my-80 md:mt-72">
    <div
      class="sm:px-4 lg:px-4 flex flex-col md:flex-row justify-between items-center justify-center w-full">


      <div
        class="z-0 items-center sm:-translate-y-3 md:-translate-y-0 md:mt-10 w-3/2 sm:w-full flex md:fixed md:relative basis-full md:basis-1/2">
        <div class="rounded-5xl lg:rounded-6xl mx-auto absolute smallTapes md:tapesImage">
          <img src="../assets/homepage_image2.png" />
        </div>
      </div>

      <div class="justify-center flex basis-1/2 px-4 lg:px-0 mx-4 z-10 sm:mr-5 mobileCard lg:antiMobileCard">
        <div class="container w-full md:w-fit md:max-w-xl">
          <p class="text-5xl sm:text-6xl lg:text-6xl font-vollkorn font-light text-primary sm:whitespace-nowrap">Don't
            Pay for Peace &nbsp;<i class="fa-solid fa-hand-peace fa-sm"></i></p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            With journaling tools, breathing exercises, and audio meditation tapes, you'll always have your mental
            toolbox in your back pocket
          </p>
          <p class="text-lg font-vollkorn font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            PeaceBox is completely <strong class="font-bold">free</strong> and will never have ads. Content and tools
            are available to all users free of cost.
          </p>
          <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
            <img src="../assets/appstore.svg" class="w-32 mt-10 borderAppStore min-w-20">
          </a>
        </div>
      </div>
    </div>

    <!--    <div>-->
    <!--      <Game/>-->
    <!--    </div>-->
  </div>

  <!-- Put your worries into words - Section 3 -->
  <div class="my-80 md:mt-72">
    <div
      class="sm:px-4 lg:px-4 flex flex-col md:flex-row justify-between items-center justify-center w-full">

      <div
        class="z-0 items-center sm:-translate-y-3 md:-translate-y-0 md:mt-10 w-3/2 sm:w-full flex md:fixed md:relative basis-full md:basis-1/2">
        <div class="rounded-5xl lg:rounded-6xl mx-auto absolute">
          <!--          <img src="../assets/homepage_image2.png" />-->
          <textarea class="outline-0 border-black rounded-lg w-40 h-72" placeholder="Put down your thoughts" cols="40"
                    rows="5"></textarea>
        </div>
      </div>

      <div class="justify-center flex basis-1/2 px-4 lg:px-0 mx-4 z-10 sm:mr-5 mobileCard lg:antiMobileCard">
        <div class="container w-full md:w-fit md:max-w-xl">
          <p class="text-5xl sm:text-6xl lg:text-6xl font-vollkorn font-light text-primary sm:whitespace-nowrap">Don't
            Pay for Peace &nbsp;<i class="fa-solid fa-hand-peace fa-sm"></i></p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            With journaling tools, breathing exercises, and audio meditation tapes, you'll always have your mental
            toolbox in your back pocket
          </p>
          <p class="text-lg font-vollkorn font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            PeaceBox is completely <strong class="font-bold">free</strong> and will never have ads. Content and tools
            are available to all users free of cost.
          </p>
          <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
            <img src="../assets/appstore.svg" class="w-32 mt-10 borderAppStore min-w-20">
          </a>
        </div>
      </div>
    </div>

    <!--    <div>-->
    <!--      <Game/>-->
    <!--    </div>-->
  </div>
</Page>
