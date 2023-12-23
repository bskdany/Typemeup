import { writable } from 'svelte/store';

export const mode = writable('typingTest');

export const wordSize = writable(0);
