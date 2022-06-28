<script>
  import "../app.css";
  import "../assets/fonts.css";

  import Page from "../components/page.svelte";
  import GithubButton from "../components/github_button.svelte";
</script>


<Page home="true">
  <div class="mainContainer">
    <div
      class="sm:px-8 lg:px-16 flex flex-row justify-between items-center justify-center w-full h-full innerContainer">
      <div class="justify-center flex w-full basis-full md:basis-2/3 lg:basis-3/5 sm:mr-10 px-4 lg:px-0">
        <div class="container w-fit max-w-xl">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-vollkorn font-light text-primary">Hi, I'm PeaceBox</p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5">
            We all deal with stress and anxiety in our lives but most of us don't know how to effectively let go of it.
          </p>
          <p class="text-lg font-baloo2 font-extralight sm:max-w-prose mb-10 text-primary mt-6 sm:mt-0 sm:pl-1.5">
            PeaceBox is like a toolbox for your mind with the tools and techniques you need to relax and de-stress.
          </p>
          <div class="flex flex-row items-center justify-around sm:justify-start">
            <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336">
              <img src="../assets/appstore.svg" class="w-44 borderAppStore min-w-32">
            </a>
            <div class="mx-4 sm:mx-16">
              <GithubButton />
            </div>

          </div>

        </div>
      </div>
      <div
        class="items-center -translate-y-3 md:-translate-y-0 md:mt-10 w-full hidden md:flex fixed opacity-30 md:opacity-100 md:relative basis-1/3 lg:basis-2/5">
        <div class="w-40 w-40 md:w-56 md:h-56 lg:h-72 lg:w-72 rounded-5xl lg:rounded-6xl mx-auto">
          <img src="../assets/logo-transparent-white-blue.png" />
        </div>
      </div>
    </div>
  </div>
</Page>
