// @ts-nocheck
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';
import { accessRestriced, checkJWT } from '../../api/account'
import type { PageLoad } from './$types'

export const load = async ({ parent, data }: Parameters<PageLoad>[0]) => {
    try{
        const result = await accessRestriced();
        return result;
    }
    catch(error){
        redirect(301, '/account')
    }
}