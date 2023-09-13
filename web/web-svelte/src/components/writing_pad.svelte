<script>
  import paper from "../assets/paper.jpg";
  import { onMount } from "svelte";

  export let size;

  $: pageWidth = size * 50;
  $: lineHeight = pageWidth / 12.2;
  $: fontSize = size * 2.5;
  $: paddingTop = lineHeight - (fontSize * 1.3);
  $: paddingLeft = pageWidth / 15;

  let lastScrollHeight;

  let pageNumber = 0;

  let textarea;

  function clearPage() {
    pageNumber++;
    textarea.value = "";
  }

  function checkScrollHeight() {
    if (textarea.scrollHeight > lastScrollHeight) {
      clearPage();
    }
  }

  onMount(() => {
    lastScrollHeight = textarea.scrollHeight;
    textarea.addEventListener("input", checkScrollHeight);
  });

  console.log("HI");
</script>

<div class="aspect-[9/14] relative overflow-hidden rounded-md shadow-lg" style={`width: ${pageWidth}px`}>
  <textarea wrap="hard" rows="5" cols="33" autocorrect="off" bind:this={textarea}
            style={`line-height: ${lineHeight}px; font-size: ${fontSize}px; padding-left: ${paddingLeft}px; padding-top: ${paddingTop}px;`}
            spellcheck="false"
            class="overflow-hidden absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none resize-none"></textarea>
  <img src={paper} class="z-[-1] absolute top-0 left-0 w-full h-full">
</div>

