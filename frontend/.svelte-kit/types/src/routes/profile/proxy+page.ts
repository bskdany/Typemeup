// @ts-nocheck
import { goto } from '$app/navigation';
import { checkJWT } from '../../api/account'
import type { PageLoad } from './$types'

export const load = async ({ parent, data }: Parameters<PageLoad>[0]) => {
    try{
        await checkJWT();
    }
    catch(error){
        goto('/account')
    }
//   return {
//     page_server_data,
//     page_data: { message: 'hello world' },
//   }
}