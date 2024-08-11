<script lang="ts">
	const { input }: { input: any } = $props();
</script>

<div>{input}</div>

<style>
	div {
		min-width: 100px;
		width: fit-content;
		height: min-content;
		white-space: nowrap;
		background-color: transparent;
		padding: var(--padding-medium);
		border: solid transparent;
		color: rgb(127, 106, 106);
		border-radius: 10px;
		background-color: #2c2e31;
	}
</style>
