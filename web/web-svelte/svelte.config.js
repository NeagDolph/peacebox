import preprocess from "svelte-preprocess";

import importAssets from "svelte-preprocess-import-assets";
import firebase from "svelte-adapter-firebase";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	kit: {
		vite: {
			ssr: {
				noExternal: ["three", "gsap"]
			},
			assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.obj", "**/*.fbx"]
		},
		browser: {
			hydrate: true,
			router: true
		},
		adapter: firebase({
			firebaseJsonPath: '../../firebase.json',
			target: 'stoicalapp'
		})
	},
	preprocess: [
		importAssets(),
		preprocess({
			postcss: true
		})
	]
};

export default config;
