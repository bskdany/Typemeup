import { fetchBackend } from '../../lib/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const data = await fetchBackend(fetch, "/profile");
    return data
  }
  catch (e) {
    console.error(e)
  }
}