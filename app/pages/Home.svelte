<script lang="typescript">
  import Free from "./Freewriting.svelte";
  import Header from "../components/Header.svelte";
  let message: string = "NeilTools";
  let motdIcon: string;

  function openSettings() {}

  $: {
    let iconList = [
      "&#xf61f;",
      "&#xf684;",
      "&#xf4ba;",
      "&#xf46a;",
      "&#xf5dc;",
      "&#xf6ad;",
    ];
    let dayMod = Math.floor((Date.now() / 86400000) % iconList.length);

    motdIcon = iconList[dayMod];
  }
</script>

<page>
  <stackLayout>
    <Header />

    <stackLayout class="tools">
      <button class="freewriting">Free Writing</button>
    </stackLayout>
  </stackLayout>
</page>

<style>
  page {
    background: #e8f0ff;
  }

  .tools .freewriting {
    font-size: 25;
    width: auto;
    height: auto;
    padding: 30 20;
    background: #6874e8;
    border-radius: 20;
    margin: 20;
    color: white;
  }
</style>
