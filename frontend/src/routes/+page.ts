import { fetchBackend } from "../lib/fetch";
import { userData } from "../userData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const data = await fetchBackend(fetch, "/config/getUserTypingConfig");
    if (data) {
      console.log(data)
      userData.username = data?.username;
      userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
    }
  }
  catch (e) {
    // nothing because yey
  }
}