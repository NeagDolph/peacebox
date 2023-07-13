<script>import { createEventDispatcher } from "svelte";
import { tick } from "svelte/internal";
import { Object3D, Vector3 } from "three";
import { useFrame, useThrelte } from "threlte";
import { createObjectStore } from "../../node_modules/threlte/lib/createObjectStore.js";
import { useTicked } from "../../node_modules/threlte/lib/useTicked.js";

export let object;
export let position = undefined;
export let scale = undefined;
export let rotation = undefined;
export let lookAt = undefined;
const targetWorldPos = new Vector3();
const dispatch = createEventDispatcher();
const { invalidate } = useThrelte();
const ticked = useTicked();
const getThrelteUserData = (object) => {
  return object.userData;
};
const dispatchTransform = async () => {
  if (!$ticked)
    await tick();
  dispatch("transform");
};
const onTransform = async () => {
  invalidate("TransformableObject: transformed");
  await dispatchTransform();
};
/**
 * Trigger the onTransform invalidation and
 * event chain with object.userData.onTransform().
 * Important for `<Instance>` components.
 */
getThrelteUserData(object).onTransform = onTransform;
const { start: startLookingAt, stop: stopLookingAt } = useFrame(async () => {
  if (lookAt && !rotation && lookAt instanceof Object3D) {
    lookAt.getWorldPosition(targetWorldPos);
    object.lookAt(targetWorldPos);
    await dispatchTransform();
  }
}, {
  autostart: false,
  debugFrameloopMessage: "TransformableObject: tracking object"
});
const objectStore = createObjectStore(object);
$: objectStore.set(object);
$: {
  if (position) {
    $objectStore.position.set(position.x ?? 0, position.y ?? 0, position.z ?? 0);
    onTransform();
  }
  if (lookAt && !rotation) {
    if (lookAt instanceof Object3D) {
      startLookingAt();
    } else {
      stopLookingAt();
      $objectStore.lookAt(lookAt.x ?? 0, lookAt.y ?? 0, lookAt.z ?? 0);
      onTransform();
    }
  }
  if (!lookAt) {
    stopLookingAt();
  }
}
$: {
  if (scale) {
    if (typeof scale === "number") {
      $objectStore.scale.set(scale, scale, scale);
    } else {
      $objectStore.scale.set(scale.x ?? 1, scale.y ?? 1, scale.z ?? 1);
    }
    onTransform();
  }
}
$: {
  if (rotation) {
    $objectStore.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0, rotation.order ?? "XYZ");
    onTransform();
  }
}
</script>
