<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { accessRestriced, logout } from '../../api/account';
    // import Cookies from 'js-cookie';

    function navigateToAHomePage() {
        goto('/');
    }

    async function logoutHandler(){
        await logout()
        goto('/account');
    }

    // onMount(async()=>{
    //     // console.log("account loaded")
    //     try{
    //         const canAccess = await accessRestriced();
    //         console.log(canAccess)
    //     }
    //     catch(error){
    //         console.log(error)
    //         goto('/account');
    //     }
    // })

</script>

<button id="homepage" on:click={navigateToAHomePage}>
    Home
</button>
<div>
   Your amazing profile
</div>
<button on:click={logoutHandler}>Logout</button>

<style>
    #homepage{
        position: absolute;
        left: 30px;
        top: 30px;
    }
</style>