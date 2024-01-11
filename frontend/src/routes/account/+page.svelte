<script lang="ts">
    import { goto } from '$app/navigation';
    import LoginToAccount from '../../components/loginToAccount.svelte';
    import RegisterAccount from '../../components/registerAccount.svelte';
    
    let loginOrRegister :string= "login";

    function navigateToAHomePage() {
        goto('/');
    }
</script>

<button id="homepage" on:click={navigateToAHomePage}>
    Back
</button>

{#if loginOrRegister === "login"}
    <LoginToAccount />
    <button class="switchLoginMode" on:click={() => loginOrRegister = "register"}>
        Register account instead
    </button>
{:else}
    <RegisterAccount />
    <button class="switchLoginMode" on:click={() => loginOrRegister = "login"}>
        Login instead
    </button>
{/if}

<style>
    #homepage{
        position: absolute;
        left: 30px;
        top: 30px;
    }

    .switchLoginMode{
        margin-top: 30px;
    }
</style>