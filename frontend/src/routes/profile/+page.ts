import { fetchBackend } from '../../lib/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const data = await fetchBackend(fetch, "/profile");
    return JSON.parse(data.message)
  }
  catch (e) {
    console.error(e)
  }
}