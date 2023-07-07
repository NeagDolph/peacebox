<script>
  import { copy } from "svelte-copy";
  import { settings } from "../stores/store.js";

  let visible = false;

  const toggle = () => visible = !visible;

  let isCopied = false;

  let copyInput;


  let APPURL;

  settings.subscribe(value => {
    APPURL = value.APPURL;
  });


  function setCopied() {
    isCopied = true;
    setTimeout(() => {
      isCopied = false;
    }, 1000);
  }


  // const app = new ClipboardCopy({
  // target: ,
  // props: { nasme },
  // });
  // app.$destroy();

  // function copyValue() {


  // }
</script>

<!-- Modal toggle -->
<div class="mx-4 sm:mx-8" on:click={toggle}>
  <i class="fa fa-share fa-xl"></i>
</div>

<!-- Main modal -->
<div id="defaultModal" tabindex="-1" aria-hidden="true" on:click|self={toggle}
     class="{visible || 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full bg-black bg-opacity-40 md:inset-0 h-modal md:h-full">
  <div class="mt-40 mx-auto relative p-4 w-full max-w-2xl h-full md:h-auto">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow bg-white">
      <!-- Modal header -->
      <div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-black">
          Share
        </h3>
        <button type="button"
                on:click={toggle}
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-6">
        <p class="text-lg leading-relaxed text-gray-500 dark:text-gray-800">
          PeaceBox can be downloaded on the iOS App Store at this URL
        </p>
        <div class="justify-center flex flex-nowrap items-center">
          <div class="h-10 w-96 flex justify-start items-center relative">
            <div
              class="h-12 w-96 absolute top-0 left-0 m-0 p-0 rounded-md bg-white border-2 border-green-400 px-3 py-2 text-md {isCopied ? '' : 'hidden'}">
              Copied! 🎉
            </div>
            <input class="mt-2 h-15 w-96 outline-0 border-2 rounded-md border-blue-300 shadow px-3 py-2 text-md"
                   bind:this={copyInput} bind:value={APPURL} use:copy={APPURL} />
          </div>
          <button
            class="mt-2 ml-2 bottom-0 h-auto leading-4 rounded-md h-fulloutline-0 border border-black shadow px-4 py-3 text-xl font-baloo2 text-gray-900"
            on:click={setCopied} use:copy={APPURL}>Copy
          </button>
        </div>
        <br>
        <p class="text-lg leading-relaxed text-gray-500 dark:text-gray-800">
          Share with friends
        </p>
      </div>
      <!-- Modal footer -->
      <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
        <button on:click={toggle} type="button"
                class="text-white text-lg bg-red-300 hover:bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-400 dark:hover:bg-red-200 dark:focus:ring-red-500">
          Close
        </button>
      </div>
    </div>
  </div>
</div>
