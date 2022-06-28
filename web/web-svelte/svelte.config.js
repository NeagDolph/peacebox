import preprocess from 'svelte-preprocess';

import importAssets from 'svelte-preprocess-import-assets';
import firebase from 'svelte-adapter-firebase';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	kit: {
		adapter: firebase({
			firebaseJsonPath: '../../firebase.json',
			target: 'stoicalapp'
		})
	},
	preprocess: [
		preprocess({
			postcss: true
		}),
		importAssets()
	]
};

export default config;
