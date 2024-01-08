<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToAHomePage() {
        goto('/');
    }
</script>

<button id="homepage" on:click={navigateToAHomePage}>
    Back
</button>

<div id="loginWrapper">
    <input placeholder="username">
    <input placeholder="password">
    <button>Login</button>
</div>


<style>
    #homepage{
        position: absolute;
        left: 30px;
        top: 30px;
    }
    #loginWrapper{
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: min-content
    }
    input{
        border: solid transparent;
        padding: 10px;
        border-radius: 10px;
        background-color: #2c2e31;
        color: white;
    }
</style>