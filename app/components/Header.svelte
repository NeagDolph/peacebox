<script lang="typescript">
  let motdIcon: string;
  
  $: {
    let iconList = [
    String.fromCharCode(0xf61f),
    String.fromCharCode(0xf684),
    String.fromCharCode(0xf4ba),
    String.fromCharCode(0xf46a),
    String.fromCharCode(0xf5dc),
    String.fromCharCode(0xf6ad),
    ];
    let dayMod = Math.floor((Date.now() / 86400000) % iconList.length);
    
    motdIcon = iconList[dayMod];
  }
</script>

<gridLayout rows="auto" columns="*" class="header">
  <stackLayout row="0" class="header-welcome">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label textWrap={false} class="header-name">
      <formattedString >
        <span class="fas" text={motdIcon} />
        <span text=" " />
        <span>Hey Neil!</span>
      </formattedString>
    </label>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <textView editable="false" textWrap="true" class="header-tools" text="What tool will help you?"/>
  </stackLayout>
  
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <button text="&#xf013;" class="fas">
    <label row="0" textWrap={false} class="header-settings fas" text="&#xf013;" />
  </button>
</gridLayout>

<style lang="scss">
  .header {
    width: 100%;
    padding: 20 25 0 25;
    
    .header-welcome {
      horizontal-align: left;
      
      .header-name {
        color: #95818d;
        font-size: 16;
        .fas {
          color: #6874e8;
        }
      }
      
      .header-tools {
        color: #2E3532;
        font-size: 23;
        width: 50%;
        padding: 0;
        margin: 10 0;
        height: auto;
        font-weight: bold;
      }
    }
    
    .header-settings {
      font-size: 30;
      horizontal-align: right;
      horizontalalign: right;
      vertical-align: top;
      verticalalign: top;
      height: auto;
      // background: black;
      
      .fas {
        vertical-align: top;
        // font-size: 30px;
        // margin: 0;
        color: #2e3532;
        background: blue;
      }
    }
  }
</style>
