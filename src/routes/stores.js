import { writable } from 'svelte/store';

export const mode = writable('typingTest');
export const pressedKeyStore = writable("")
export const wordSize = writable(0);
