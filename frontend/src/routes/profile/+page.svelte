<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToAHomePage() {
        goto('/');
    }
</script>



<button id="homepage" on:click={navigateToAHomePage}>
    Home
</button>
<div>
   Your amazing profile
</div>

<style>
    #homepage{
        position: absolute;
        left: 30px;
        top: 30px;
    }
</style>