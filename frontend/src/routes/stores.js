import { writable } from 'svelte/store';

export const mode = writable('typingTest');
export const pressedKeyStore = writable({value: "", timestamp: 0})
export const wordSizeStore = writable(0);
export const typingTestModeStore = writable("time");
export const typingTestTimeStore = writable(0);
