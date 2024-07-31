<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<div id="bubbleContainer">
	{@render children()}
</div>

<style>
	#bubbleContainer {
		background-color: var(--primary-color);
		border-radius: var(--border-radius);
		padding: var(--padding-medium);
		display: flex;
		justify-content: center;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
