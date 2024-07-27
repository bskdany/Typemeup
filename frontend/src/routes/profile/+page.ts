import { getData } from '../../api/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {

  return getData("/profile")
}