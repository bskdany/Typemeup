<script lang="ts">
    import WpmResult from "./wpmResult.svelte";
    export let typingTestWpm :number;
</script>

<WpmResult typingTestWpm={typingTestWpm}/>
<div>Press TAB to restart</div>

<style>
    div{
        color: rgb(235, 226, 226);
        font-size: 1.5rem;
        margin-top: 1rem;
    }
</style>