import { getData } from '../../api/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
  try {
    const data = await getData("/profile");
    return JSON.parse(data.message)
  }
  catch (e) {
    console.error(e)
  }
}