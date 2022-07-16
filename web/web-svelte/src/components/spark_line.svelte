<script>
  import { Mesh, useFrame } from "threlte";
  import { MeshLineMaterial } from "../helpers/MeshLine/material.js";
  import { MeshLine } from "../helpers/MeshLine/meshline.js";
  import { onMount } from "svelte";
  import { MeshLineRaycast } from "../helpers/MeshLine/index.js";

  export let curve, width, color, speed, pointLength, offset = false;


  $: {
    if (mainMesh) mainMesh.raycast = MeshLineRaycast;
  }

  let material, line, mainMesh;

  onMount(() => {

    console.log(mainMesh.raycast);
    mainMesh.raycast = MeshLineRaycast;

    material = new MeshLineMaterial({
      depthTest: true,
      lineWidth: width,
      color: offset ? "#ddd" : color,
      dashArray: offset ? 1 : 0.2,
      opacity: 0.6,
      useDash: 1,
      // dashOffset: offset ? 80 : 0,
      transparent: true,

      dashRatio: offset ? 0 : 0.4325
    });

    line = new MeshLine();
    line.setPoints(curve);
  });

  useFrame(() => {
    material.uniforms.dashOffset.value -= speed;
  });
</script>


<Mesh
  material={material}
  bind:mesh={mainMesh}
  geometry={line}
/>
