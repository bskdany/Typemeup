import { fetchBackend } from '../../lib/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    return await fetchBackend(fetch, "/profile/getTypingHistory");
  }
  catch (e) {
    console.error(e)
  }
}