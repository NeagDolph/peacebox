<script>
  import { BoxBufferGeometry, MeshPhongMaterial } from "three";
  import {
    AmbientLight,
    Canvas,
    Group,
    Line2,
    Mesh,
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
  import o_px_upside from "../assets/logoCube_opposite/px_upside.png";
  import o_py from "../assets/logoCube_opposite/py.png";
  import o_pz from "../assets/logoCube_opposite/pz.png";
  import o_ny from "../assets/logoCube_opposite/ny.png";
  import o_nz from "../assets/logoCube_opposite/nz.png";
  import displacementMap from "../assets/DisplacementMap.png";
  import normalMap from "../assets/px2.png";

  import { cube } from "../helpers/cube.js";

  import { onMount } from "svelte";
  import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
  import { logoActive } from "../stores/store.js";
  import { useCursor } from "threlte/extras";

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
  const texture_opposite = useTexture([o_pz, o_py, o_px, o_px_upside, o_ny, o_nz]);

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


  $: logoMaterial = texture.map(el => new MeshPhongMaterial({ shininess: 10, color: "#ffffff", map: el }));
  // $: holdingMaterial = texture_opposite.map(el => new MeshPhongMaterial({ shininess: 0, color: "#ffffff", map: el, normalMap: normalTexture, normalScale: new Vector2(10, 40) }));


  const heatVertex = `
    uniform sampler2D heightMap;
    uniform float heightRatio;
    varying vec2 vUv;
    varying float hValue;
    void main() {
      vUv = uv;
      vec3 pos = position;
      hValue = texture2D(heightMap, vUv).r;
      pos.y = hValue * heightRatio;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `;
  const heatFragment = `
    varying float hValue;

    // honestly stolen from https://www.shadertoy.com/view/4dsSzr
    vec3 heatmapGradient(float t) {
      return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
    }

    void main() {
      float v = abs(hValue - 1.);
      gl_FragColor = vec4(heatmapGradient(hValue), 1. - v * v) ;
    }
  `;

  $: holdingMaterial = texture_opposite.map(el => new MeshPhongMaterial({
    // uniforms: {
    //   heightMap: {value: normalTexture},
    //   heightRatio: {value: 0.3}
    // },
    map: el,
    // color: "red",
    vertexShader: heatVertex,
    fragmentShader: heatFragment,
    transparent: true
  }));


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
    holding = true;

    firstTouch = true;
    lastPlace = cameraCalcY;
    fovScale.set(1.8);
  }

  function unholdBox() {
    holding = false;

    if (!hovering) onPointerLeave();

    fovScale.set(hovering ? 1.35 : 1.45);

  }


  let controls, pageY, startPos = 0, firstTouch = false, lastX = 16, lastY = 6, lastZ = 16;
  let lastPlace, cameraCalcY;


  $: cameraCalcY = firstTouch ? lastPlace : -((pageY + startPos) / 70);


</script>

<svelte:window bind:scrollY={pageY} />

<Canvas
  linear
  flat
  size={{width: 350, height: 350}}
>

  <!--  Shaders-->
  <!--  <Pass pass={new RenderPass($scene, logoCamera )}>-->

  <!--  Camera -->
  <!--  y - 6-->a
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

  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: 200, y: 200, z: 200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: -200, y: 200, z: 200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: 200, y: 200, z: -200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: -200, y: 200, z: -200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: 200, y: -200, z: 200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: -200, y: -200, z: 200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: 200, y: -200, z: -200}} />
  <SpotLight power={6} intensity={0.21} penumbra={0.5} target={boxMesh} position={{x: -200, y: -200, z: -200}} />


  <AmbientLight intensity={0.5} />


  <Group scale={0.3 + ($scale / 10)} rotation={{y: $logoRotate,}}>
    <Mesh
      interactive
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
      points={cube(1.005)}
      position={{ x: 0.000, y: boxHeight, z: 0.000}}
      scale={1}
      material={new LineMaterial({
          worldUnits: true,
          color: holding ? "#6874E8" : "#c2c7f7",
          linewidth: 0.017 * (($scale + 1) / 4)
        })}
    />
  </Group>

</Canvas>
