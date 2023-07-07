import { writable } from 'svelte/store';

export const settings = writable({
	APPURL: 'https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336'
});

export const logoActive = writable(0);
export const logoStyle = writable();
