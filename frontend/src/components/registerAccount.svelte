<script lang="ts">
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import { register } from "../api/account";

    let username :string= "";
    let password1 :string= "";
    let password2 :string= "";
    let errorMessage :any = "";
    const dispatch = createEventDispatcher()

    const registerAccount = async() => {
        if(password1 != password2){
            errorMessage = "Passwords are different";
            return
        }
        try{
            const result = await register(username, password1);
            console.log(result);
            dispatch("accountRegistered")
        }
        catch(error){
            errorMessage = error;
        }
    }

</script>    


<div id="loginWrapper">
    <input placeholder="username" bind:value={username}>
    <input type="password" placeholder="password" bind:value={password1}>
    <input type="password" placeholder="repeat password" bind:value={password2}>
    <button on:click={registerAccount}>Register</button>
</div>
<div id="errorMessage">{errorMessage}</div>


<style>
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
    #errorMessage{
        margin-top: 10px;
        color: rgb(215, 61, 61);
        height: 1rem;
    }
</style>