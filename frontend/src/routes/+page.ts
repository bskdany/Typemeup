import { fetchBackend } from "../lib/fetch";
import { userData } from "../globalUserData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const data = await fetchBackend(fetch, "/config/getUserConfig");
    userData.username = data.username
  }
  catch (e) {
    console.error(e)
  }
}