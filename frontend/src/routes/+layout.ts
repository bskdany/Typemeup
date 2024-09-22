import { fetchBackend } from "../lib/fetch";
import { isSessionFresh, userData, setInitialized, getWordsFile, loadWordsFile } from "../shared/userData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }: any) => {
	if (isSessionFresh()) {
		try {
			const data = await fetchBackend(fetch, "/profile/getUserData");
			if (data) {
				userData.username = data?.username;
				userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
				userData.keyStatistics = JSON.parse(data?.keyStatistics);
				await loadWordsFile(userData.userTypingConfig.typingLanguage);
				setInitialized(true)
			}
		}
		catch (e) {
			console.error(e);
		}
	}
}
