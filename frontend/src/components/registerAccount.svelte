<div id="loginWrapper">
    <input placeholder="username">
    <input type="password" placeholder="password">
    <input type="password" placeholder="repeat password">
    <button>Login</button>
</div>

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
</style>