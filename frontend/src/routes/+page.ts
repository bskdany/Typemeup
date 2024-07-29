import { getData } from "../api/fetch";
import { userData } from "../globalUserData.svelte";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ parent, data }) => {
  try {
    const data = await getData("/config/getUserConfig");
    userData.username = data.username
  }
  catch (e) {
    console.error(e)
  }
}