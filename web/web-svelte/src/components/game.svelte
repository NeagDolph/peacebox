<script>
  import { BoxBufferGeometry, Color, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from "three";
  import {
    AmbientLight,
    Canvas,
    GLTF,
    Group,
    Line2,
    Mesh as MeshT,
    Object3DInstance,
    OrbitControls,
    PerspectiveCamera,
    SpotLight,
    useTexture
  } from "threlte";
  import { spring, tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import px from "../assets/logoCube/px.png";
  import px_upside from "../assets/logoCube/px_upside.png";
  import py from "../assets/logoCube/py.png";
  import pz from "../assets/logoCube/pz.png";
  import ny from "../assets/logoCube/ny.png";
  import nz from "../assets/logoCube/nz.png";

  import o_px from "../assets/logoCube_opposite/px.png";
  import o_ny from "../assets/logoCube_opposite/ny.png";
  import displacementMap from "../assets/DisplacementMap.png";
  import normalMap from "../assets/px2.png";


  // import couch_obj from "../assets/couchObj.glb";
  import couch_texture from "../assets/couch/colormap.png";
  import couch_ao from "../assets/couch/aomap.png";
  import couch_normal from "../assets/couch/normalmap.png";

  import rug_texture from "../assets/rug.jpg";
  import Spark from "./spark.svelte";

  import cube from "../helpers/cube.js";

  import { onMount } from "svelte";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { logoActive } from "../stores/store.js";
  import { useCursor, useGltf } from "threlte/extras";

  import { browser } from "$app/env";


  import couchObj from "../assets/couchObj.glb";
  import lampObj from "../assets/lampObj.glb";
  import rugObj from "../assets/rug2.glb";
  import tableObj from "../assets/table.glb";
  import phoneObj from "../assets/phone.gltf";
  import tvObj from "../assets/tv.glb";

  let usingCamera = false, holding = false, hovering = false;


  let handle, rotate, boxMesh, logoCamera;

  let logoActiveVal;

  logoActive.subscribe(value => {
    logoActiveVal = value;
  });


  let tempNum = 0;

  onMount(() => {
    startPos = -pageY;
    // console.log("EEE", cameraCalcY)


    // function canvasEl(e) {
    //   console.log("Persp", e)
    // }


    setTimeout(() => {
      fovScale.set(1.45);
    }, 1900);

    setTimeout(() => {
      setInterval(() => {


        if (!usingCamera) {

          if (!holding) {
            logoRotate.set((1.5708) * (tempNum / 100));

            tempNum -= 1;
          }
        }
      }, 60);
    }, 2000);
  });


  const texture = useTexture([pz, py, px, px_upside, ny, nz]);
  const texture_opposite = useTexture([o_px, o_ny, o_ny, o_ny, o_ny, o_ny]);
  let scale = spring(0.4, {
    // stiffness: 0.1,
    // damping: 2
  });

  let fovScale = spring(1.6, {
    // stiffness: 0.1,
    // damping: 2
  });

  const logoRotate = tweened(0, {
    duration: 60,
    easing: linear
  });

  // const displacementTexture = useTexture([displacementMap, displacementMap, displacementMap, displacementMap, displacementMap, displacementMap])
  const displacementTexture = useTexture(displacementMap);
  // const normalTexture = useTexture([normalMap, normalMap, normalMap, normalMap, normalMap_other, normalMap_other])
  const normalTexture = useTexture(normalMap);


  $: logoMaterial = texture.map(el => new MeshPhongMaterial({
    shininess: 10,
    color: "#ffffff",
    map: el,
    flatShading: true
  }));

  let faceMaterial = new MeshBasicMaterial({
    map: texture_opposite[0],
    transparent: true
  });

  let faceGeometry = new PlaneGeometry(1, 1);

  $: holdingMaterial = texture_opposite.map(el => new MeshPhongMaterial({
    map: el,
    // refractionRatio: 0,
    // reflectivity: 0,
    // opacity: 0,
    transparent: true,
    alphaMap: new Color(0, 0, 0, 0),
    // wireframe: true,
    color: new Color("rgba(0, 0, 0, 0)"),
    wireframeLinewidth: 20
    // wireframe:true
  }));


  let canvasEl;

  $: boxHeight = 1.7 - ($scale / 2);

  const { onPointerEnter, onPointerLeave } = useCursor();

  function boxHover() {
    hovering = true;

    onPointerEnter();
    if (!holding) {
      fovScale.set(1.35);
    }
  }

  function boxUnhover() {
    hovering = false;

    if (!holding) {
      fovScale.set(1.45);

      onPointerLeave();
    }
  }

  function holdBox() {

    fovScale.set(1.8);

    holding = true;

    console.log("HE", tableMats);
    // tableMats
    // tableMats.mat0 = couch_mat

    if (tableMats.mat0 && tableMats.mat1) {
      tableMats.mat0.color = (new Color(0.78, 0.53, 0.36));
      tableMats.mat1.color = (new Color(0.2, 0.1, 0.05));
      // tableMats.mat1 = couch_mat
    }

    firstTouch = true;
    lastPlace = cameraCalcY;
  }

  function unholdBox() {
    holding = false;

    if (!hovering) onPointerLeave();

    fovScale.set(hovering ? 1.35 : 1.45);

  }


  let controls, pageY, startPos = 0, firstTouch = false, lastX = 16, lastY = 6, lastZ = 16;
  let lastPlace, cameraCalcY;


  $: cameraCalcY = firstTouch ? lastPlace : -((pageY + startPos) / 70);

  let object, targetPos;


  const couchTexture = useTexture(couch_texture);

  const rugTexture = useTexture(rug_texture);

  let couch_mat = new MeshPhongMaterial({
    shininess: 90,
    map: couchTexture,
    color: new Color(0x000000),
    // specular: new Color(0xffffff),
    aoMap: couch_ao,
    normalMap: couch_normal,
    aoMapIntensity: 2.0,
    lightMapIntensity: 2.0
  });

  let couchGltf, lampGltf, rugGltf, tableGltf, phoneGltf;

  if (browser) {

    couchGltf = useGltf(couchObj).gltf;
    lampGltf = useGltf(lampObj).gltf;
    rugGltf = useGltf(rugObj).gltf;
    phoneGltf = useGltf(phoneObj).gltf;
    console.log("<", tableObj);
    tableGltf = useGltf(tableObj).gltf;
    console.log(tableGltf);

  }

  function getCouchGltf(gltf) {
    const returnGltf = gltf;
    let couchNode = returnGltf.nodes["Rectangle001"];
    couchNode.material.color.setRGB(3, 2, 2);
    return couchNode;
  }

  function getLampGltf(gltf, shade = "plafon") {
    const returnGltf = gltf;
    let lampNode = returnGltf.nodes[shade];
    if (!lampNode.material && lampNode.children) {
      lampNode.children.forEach(el => el.material.color.setRGB(1, 1, 1));
    } else {
      lampNode.material.color.setRGB(...(shade === "plafon" ? [1, 0.9, 0.7] : [0.6, 0.6, 0.6]));
    }
    return lampNode;
  }

  function getRugGltf(gltf, shade = 0) {
    const returnGltf = gltf;
    let rugNode = returnGltf.nodes[shade];
    rugNode.material.color.setRGB(0.1, 0.1, 0.3);
    rugNode.material.emissive.setRGB(0.1, 0.2, 0.2);

    return rugNode;
  }

  // function getTableGltf(gltf, shade = 0) {
  //   const returnGltf = gltf;
  //   let tableNode = returnGltf.nodes[shade];
  //   console.log("HMMM", rugTexture, rug_texture, tableNode.material);
  //   tableNode.material.color.setRGB(0.1, 0.1, 0.3);
  //   tableNode.material.emissive.setRGB(0.1, 0.2, 0.2);
  //
  //   console.log(tableNode, tableNode.geometry);
  //   return tableNode;
  // }

  let tableMats;

  let tableMaterial = new MeshBasicMaterial({
    map: texture[0],
    shininess: 0,
    reflectivity: 0,
    color: 0xffffff
  });

</script>

<svelte:window bind:scrollY={pageY} />


<Canvas
  linear
  flat
  bind:this={canvasEl}
  size={{width: 350, height: 350}}
>

  <!--  Shaders-->
  <!--  <Pass pass={new RenderPass($scene, logoCamera )}>-->

  <!--  Camera -->
  <!--  y - 6-->
  <PerspectiveCamera position={{ x: 16, y: 6 + cameraCalcY, z: 16 }} fov={$fovScale} lookAt={{y: -2, x: 0, z: 0}}
                     bind:camera={logoCamera}>
    <OrbitControls
      autoRotate={false}
      enableRotate={true}
      enablePan={false}
      enableDamping
      enableZoom={false}
      target={{ y: 0.5 }}
      minPolarAngle={-Math.PI}
      on:start={holdBox}
      bind:controls={controls}
      on:end={unholdBox}
    />
  </PerspectiveCamera>

  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: 200, y: 200, z: 200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: -200, y: 200, z: 200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: 200, y: 200, z: -200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: -200, y: 200, z: -200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: 200, y: -200, z: 200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: -200, y: -200, z: 200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: 200, y: -200, z: -200}} />
  <SpotLight power={6} intensity={holding ? 0.26 : 0.21} penumbra={0.5} target={boxMesh}
             position={{x: -200, y: -200, z: -200}} />


  <AmbientLight intensity={0.5} />


  <!--  <Object3D bind:object={object} />-->
  <Group scale={0.3 + ($scale / 10)} rotation={{y: $logoRotate}}>

    <!--        <GLTF materials={couch_mat} url={'src/assets/couchObj.gltf'} scale={0.0006} castShadow={true} receiveShadow position={{y: 2}} />-->
    <!--    <Pass pass={new BloomPass(0.005, 5, 1, 350)}>-->

    {#if browser}

      {#if $couchGltf} <!-- Couch -->
        <Object3DInstance object={getCouchGltf($couchGltf)} materials={$couchGltf.materials} scale={0.00023}
                          castShadow={true} receiveShadow position={{x: -0.08, z: -0.36, y: 1.005}} />
      {/if}

      {#if $lampGltf} <!-- Lamp -->
        <Object3DInstance object={getLampGltf($lampGltf, "Metal")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.43, z: -0.45, y: 1.44}} />
        <Object3DInstance object={getLampGltf($lampGltf, "plafon")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.425, z: -0.365, y: 1.4}} />
        <Object3DInstance object={getLampGltf($lampGltf, "Glass")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.43, z: -0.45, y: 1.43}} />
      {/if}

      {#if $rugGltf} <!-- Rug -->
        <Object3DInstance object={getRugGltf($rugGltf, 'm')} scale={0.0004} rotation={{z: -1.5708, x: -1.5708}}
                          castShadow={true} receiveShadow position={{x: 0, z: 0.05, y: 1}} />
        <!--      <MeshT geometry={getRugGltf($rugGltf, "m")} material={couch_mat} scale={0.0004}  rotation={{z: -1.5708, x: -1.5708}} position={{x: 0, z: 0.05, y: 1}}/>-->
      {/if}
      {#if $couchGltf} <!-- Couch -->
        <Object3DInstance object={getCouchGltf($couchGltf)} materials={$couchGltf.materials} scale={0.00023}
                          castShadow={true} receiveShadow position={{x: -0.08, z: -0.36, y: 1.005}} />
      {/if}

      {#if $lampGltf} <!-- Lamp -->
        <Object3DInstance object={getLampGltf($lampGltf, "Metal")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.43, z: -0.45, y: 1.44}} />
        <Object3DInstance object={getLampGltf($lampGltf, "plafon")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.425, z: -0.365, y: 1.4}} />
        <Object3DInstance object={getLampGltf($lampGltf, "Glass")} materials={$lampGltf.materials} scale={0.35}
                          castShadow={true} receiveShadow position={{x: 0.43, z: -0.45, y: 1.43}} />
      {/if}

      {#if $rugGltf} <!-- Rug -->
        <Object3DInstance object={getRugGltf($rugGltf, 'm')} scale={0.0004} rotation={{z: -1.5708, x: -1.5708}}
                          castShadow={true} receiveShadow position={{x: 0, z: 0.05, y: 1}} />
        <!--      <MeshT geometry={getRugGltf($rugGltf, "m")} material={couch_mat} scale={0.0004}  rotation={{z: -1.5708, x: -1.5708}} position={{x: 0, z: 0.05, y: 1}}/>-->
      {/if}

      <!-- Various objects -->
      <GLTF url={phoneObj} rotation={{ y: 1.5708 * 2}} bind:materials={tableMats}
            position={{x: 0.15, z: -0.02, y: 1.185}} scale={0.02} />
      <GLTF url={tvObj} rotation={{ y: 1.5708 }} bind:materials={tableMats}
            position={{x: -0, z: 0.43, y: 1.185}} scale={0.02} />
      <GLTF url={tableObj} rotation={{x: 0, y: 1.5708}}
            bind:materials={tableMaterial} position={{x: 0, z: 0.1, y: 1.01}} scale={{y: 0.325, x: 0.5, z: 0.5}} />
    {/if}

    {#if holding}
      <MeshT
        geometry={faceGeometry}
        material={faceMaterial}
        position={{ y: boxHeight, z: 0.51 }}
      ></MeshT>
      <MeshT
        geometry={faceGeometry}
        material={faceMaterial}
        rotation={{y: 2 * 1.5708}}
        position={{ y: boxHeight, z: -0.51 }}
      ></MeshT>
      <MeshT
        geometry={faceGeometry}
        material={faceMaterial}
        scale={0.1}
        rotation={{z: 2 * 1.5708, x:-1.5708}}
        position={{ x: 0.145, y: 1.19, z: -0.02 }}
      ></MeshT>
    {/if}
    <MeshT
      interactive
      receiveShadow={true}
      position={{ y: boxHeight}}
      rotation={{x: 1.5708}}
      on:pointerenter={boxHover}
      on:pointerleave={boxUnhover}
      on:mousedown={holdBox}
      on:mouseup={unholdBox}
      castShadow
      geometry={new BoxBufferGeometry(1, 1, 1)}
      material={holding ? holdingMaterial : logoMaterial}
    />
    <Line2
      points={cube(1.004)}
      position={{ x: 0.000, y: boxHeight, z: 0.000}}
      scale={1}
      material={new LineMaterial({
          worldUnits: true,
          color: holding ? "#dddddd" : "#c2c7f7",
          linewidth: 0.017 * (($scale + 1) / 4)
        })}
    />
    {#if holding}
      <Spark />
    {/if}
  </Group>

</Canvas>
