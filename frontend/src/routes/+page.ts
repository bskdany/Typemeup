import { fetchBackend } from '../lib/fetch';
import { initUserData, isSessionFresh } from '../shared/userData.svelte';
import type { PageLoad } from './profile/$types';

export const load: PageLoad = async ({ fetch }: any) => {
	if (isSessionFresh()) {
		try {
			const data = await fetchBackend(fetch, '/profile/getUserData');
			await initUserData(data);
		} catch (e) {
			console.error(e);
		}
	}
};
