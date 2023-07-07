<script>

  let year = new Date().getFullYear();
</script>

<div>
  <div class="w-full left-0 bg-primaryBg p-6">
    <!--    <div class="flex flex-row items-center justify-around sm:justify-center w-full sm:w-auto">-->
    <!--      <a href="https://github.com/neagdolph/peacebox" target="_blank">-->
    <!--        <p class="font-baloo2 text-xl text-light whitespace-nowrap">-->
    <!--          <i class="fa-brands fa-github fa-md sm:fa-lg"></i> &nbsp;Github-->
    <!--        </p>-->
    <!--      </a>-->
    <!--      <div class="min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12"></div>-->
    <!--      <a href="https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336" class="hidden sm:block">-->
    <!--        <img src="../assets/appstore_black.svg" class="w-44 borderAppStore min-w-32">-->
    <!--      </a>-->
    <!--      <div class="min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"></div>-->
    <!--      <a href="mailto:contact@peacebox.app" target="_blank">-->
    <!--        <p class="font-baloo2 text-xl text-light whitespace-nowrap">-->
    <!--          <i class="fa-solid fa-envelope fa-md sm:fa-lg"></i> &nbsp;Email-->
    <!--        </p>-->
    <!--      </a>-->
    <!--    </div>-->
    <div
      class="flex flex-row items-center px-10 justify-around sm:justify-between max-w-3xl mx-auto w-full sm:w-auto mt-3 mb-8">
      <a href="/privacy">
        <p class="font-baloo2 text-md md:text-xl text-light whitespace-nowrap">
          &nbsp; Privacy
        </p>
      </a>
      <div class="min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"></div>
      <a href="/terms">
        <p class="font-baloo2 text-md md:text-xl text-light whitespace-nowrap">
          &nbsp; Terms
        </p>
      </a>
      <div class="min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"></div>
      <a href="/license">
        <p class="font-baloo2 text-md md:text-xl text-light whitespace-nowrap">
          &nbsp; License
        </p>
      </a>
    </div>
    <div class="mx-auto">
      <p class="font-roboto text-md text-light text-center">
        © <span id="copyright">{year || 2022}</span> Neil Agrawal
      </p>
    </div>
  </div>
</div>
