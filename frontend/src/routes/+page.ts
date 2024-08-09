import { fetchBackend } from "../lib/fetch";
import { userData } from "../shared/userData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const data = await fetchBackend(fetch, "/profile/getUserData");
    if (data) {
      userData.username = data?.username;
      userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
      userData.fingersStatistics = JSON.parse(data?.fingersStatistics);

      console.log(userData)
    }
  }
  catch (e) {
    console.error(e);
  }
}