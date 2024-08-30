import { fetchBackend } from "../lib/fetch";
import { isSessionFresh, userData } from "../shared/userData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }) => {
  if (isSessionFresh()) {
    try {
      const data = await fetchBackend(fetch, "/profile/getUserData");
      if (data) {
        userData.username = data?.username;
        userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
        userData.keyStatistics = JSON.parse(data?.keyStatistics);
      }
      console.log(userData)
      return { data: data };
    }
    catch (e) {
      console.error(e);
    }
  }
}