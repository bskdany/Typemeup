<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import {logout } from '../../api/account';

    function navigateToAHomePage() {
        goto('/');
    }

    async function logoutHandler(){
        await logout();
        goto('/account');
    }
    $: result = $page.data.message;
    onMount(() => {
    // Log or use the result when the component is mounted
    console.log(result);
  });
</script>

<button id="homepage" on:click={navigateToAHomePage}>
    Home
</button>
<div>
    {result}
</div>
<button on:click={logoutHandler} id="logout">Logout</button>

<style>
    #homepage{
        position: absolute;
        left: 30px;
        top: 30px;
    }
    #logout{
        position: absolute;
        right: 30px;
        top: 30px;
    }
</style>