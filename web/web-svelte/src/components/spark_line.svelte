<script>
  import { Mesh, useFrame } from "threlte";
  import { MeshLineMaterial } from "../helpers/MeshLine/material.js";
  import { MeshLine } from "../helpers/MeshLine/meshline.js";
  import { onMount } from "svelte";
  import { MeshLineRaycast } from "../helpers/MeshLine/index.js";
  import { Vector2 } from "three";

  export let curve, width, color, speed, offset = false;


  $: {
    if (mainMesh) mainMesh.raycast = MeshLineRaycast;
  }

  let material, line, mainMesh;

  onMount(() => {
    mainMesh.raycast = MeshLineRaycast;

    material = new MeshLineMaterial({
      depthTest: true,
      lineWidth: 5,
      color: offset ? "#ddd" : color,
      // dashArray: offset ? 1 : 0.2,
      dashArray: 0.005,
      resolution: new Vector2(400, 400),
      opacity: 0.6,
      sizeAttenuation: 0,
      // useDash: 1,
      dashOffset: offset ? 80 : 0,
      transparent: true,

      dashRatio: 0.3
      // dashRatio: offset ? 0 : 0.4325
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
