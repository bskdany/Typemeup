import { getData } from "../api/fetch";
import type { PageLoad } from "./profile/$types";

export const load: PageLoad = async ({ parent, data }) => {
  try {
    const data = await getData("/config/getUserConfig");
    return JSON.parse(data.message)
  }
  catch (e) {
    console.error(e)
  }
}