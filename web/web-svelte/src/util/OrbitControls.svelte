<script>import { createEventDispatcher, getContext, onDestroy } from "svelte";
import { Camera, Object3D } from "three";
import { TrackballControls as ThreeOrbitControls } from "./TrackballControls.js";
import { useFrame, useThrelte } from "threlte";
import TransformableObject from "./TransformableObject.svelte";

export let autoRotate = undefined;
export let autoRotateSpeed = undefined;
export let dampingFactor = undefined;
export let enableDamping = undefined;
export let enabled = undefined;
export let enablePan = undefined;
export let enableRotate = undefined;
export let enableZoom = undefined;
export let keyPanSpeed = undefined;
export let keys = undefined;
export let maxAzimuthAngle = undefined;
export let maxDistance = undefined;
export let maxPolarAngle = undefined;
export let maxZoom = undefined;
export let minAzimuthAngle = undefined;
export let minDistance = undefined;
export let minPolarAngle = undefined;
export let minZoom = undefined;
export let mouseButtons = undefined;
export let panSpeed = undefined;
export let rotateSpeed = undefined;
export let screenSpacePanning = undefined;
export let touches = undefined;
export let zoomSpeed = undefined;
export let target = undefined;
const getThrelteUserData = (object) => {
  return object.userData;
};

const getParent = () => {
  return getContext("threlte-parent");
};
const parent = getParent();
const { renderer, invalidate } = useThrelte();
if (!renderer)
  throw new Error("Threlte Context missing: Is <OrbitControls> a child of <Canvas>?");
if (!($parent instanceof Camera)) {
  throw new Error("Parent missing: <OrbitControls> need to be a child of a <Camera>");
}
const dispatch = createEventDispatcher();
const onChange = () => {
  invalidate("Orbitcontrols: change event");
  dispatch("change");
};
const onStart = () => dispatch("start");
const onEnd = () => dispatch("end");
export const controls = new ThreeOrbitControls($parent, renderer.domElement);
getThrelteUserData($parent).orbitControls = controls;
controls.addEventListener("change", onChange);
controls.addEventListener("start", onStart);
controls.addEventListener("end", onEnd);
onDestroy(() => {
  delete getThrelteUserData($parent).orbitControls;
  controls.removeEventListener("change", onChange);
  controls.removeEventListener("start", onStart);
  controls.removeEventListener("end", onEnd);
});
$: {
  if (autoRotate !== undefined)
    controls.autoRotate = autoRotate;
  if (autoRotateSpeed !== undefined)
    controls.autoRotateSpeed = autoRotateSpeed;
  if (dampingFactor !== undefined)
    controls.dampingFactor = dampingFactor;
  if (enableDamping !== undefined)
    controls.enableDamping = enableDamping;
  if (enabled !== undefined)
    controls.enabled = enabled;
  if (enablePan !== undefined)
    controls.enablePan = enablePan;
  if (enableRotate !== undefined)
    controls.enableRotate = enableRotate;
  if (enableZoom !== undefined)
    controls.enableZoom = enableZoom;
  if (keyPanSpeed !== undefined)
    controls.keyPanSpeed = keyPanSpeed;
  if (keys !== undefined)
    controls.keys = keys;
  if (maxAzimuthAngle !== undefined)
    controls.maxAzimuthAngle = maxAzimuthAngle;
  if (maxDistance !== undefined)
    controls.maxDistance = maxDistance;
  if (maxPolarAngle !== undefined)
    controls.maxPolarAngle = maxPolarAngle;
  if (maxZoom !== undefined)
    controls.maxZoom = maxZoom;
  if (minAzimuthAngle !== undefined)
    controls.minAzimuthAngle = minAzimuthAngle;
  if (minDistance !== undefined)
    controls.minDistance = minDistance;
  if (minPolarAngle !== undefined)
    controls.minPolarAngle = minPolarAngle;
  if (minZoom !== undefined)
    controls.minZoom = minZoom;
  if (mouseButtons !== undefined)
    controls.mouseButtons = mouseButtons;
  if (panSpeed !== undefined)
    controls.panSpeed = panSpeed;
  if (rotateSpeed !== undefined)
    controls.rotateSpeed = rotateSpeed;
  if (screenSpacePanning !== undefined)
    controls.screenSpacePanning = screenSpacePanning;
  if (touches !== undefined)
    controls.touches = touches;
  if (zoomSpeed !== undefined)
    controls.zoomSpeed = zoomSpeed;
  controls.update();
  invalidate("OrbitControls: props changed");
}
const { start, stop } = useFrame(() => controls.update(), {
  autostart: false,
  debugFrameloopMessage: "OrbitControlts: updating controls"
});
$: {
  if (autoRotate || enableDamping)
    start();
  else
    stop();
}
const targetObject = new Object3D();
const updateControls = () => {
  controls.target = targetObject.position;
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = 2 * Math.PI; // radians
  controls.update();
  invalidate("OrbitControls: target changed");
};
onDestroy(() => {
  controls.dispose();
  invalidate("OrbitControls: onDestroy");
});
</script>

<TransformableObject on:transform={updateControls} object={targetObject} position={target} />
