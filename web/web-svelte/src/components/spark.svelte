<script>
  import { Group } from "threlte";
  import SparkLine from "./spark_line.svelte";
  import * as THREE from "three";
  import cube from "../helpers/cube.js";

  const colors = ["#6975E9"];

  const count = 30;

  const radius = 2.5;


  $: lines = [[]].map((_, index) => {

    const cubePoints = cube(1.02).map(el => new THREE.Vector3(el[0], 1.5 + el[1], el[2]));

    const curve = new THREE.CatmullRomCurve3(cubePoints, false, "catmullrom", 0.01).getPoints(1000);

    // const curve = cube(1)


    return {
      color: colors[parseInt(colors.length * Math.random(), 10)],
      width: (0.2) / 30,
      speed: 0.00025,
      curve
    };
  });

</script>


<Group position={[-radius * 2, -radius, -1]} scale={[0.2, 0.3, 0.2]}>
  <!--{#each lines as line}-->
  <!--  <SparkLine {...line} offset={true} />-->
  <!--{/each}-->

  {#each lines as line}
    <SparkLine {...line} />
  {/each}
</Group>
