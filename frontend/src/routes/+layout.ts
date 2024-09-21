import { fetchBackend } from "../lib/fetch";
import { isSessionFresh, userData, setInitialized, setWordsFile, getWordsFile } from "../shared/userData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }) => {
	if (isSessionFresh()) {
		try {
			const data = await fetchBackend(fetch, "/profile/getUserData");
			if (data) {
				userData.username = data?.username;
				userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
				userData.keyStatistics = JSON.parse(data?.keyStatistics);
				setWordsFile(await import(`../static/languages/${userData.userTypingConfig.typingLanguage}.json`));
				setInitialized(true)
				console.log(getWordsFile())
			}
			console.log(userData.userTypingConfig)
		}
		catch (e) {
			console.error(e);
		}
	}
}
