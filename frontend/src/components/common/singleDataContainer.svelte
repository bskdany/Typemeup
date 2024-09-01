<script lang="ts">
	const { title, data, data_rem = 1 } = $props();
</script>

<div id="singleDataContainer">
	<div id="title">{title}</div>
	<div id="data" style="font-size: {data_rem}rem;">{data}</div>
</div>

<style>
	#singleDataContainer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: min(100px, fit-content);
		height: min-content;
		white-space: nowrap;

		background-color: transparent;
		padding: var(--padding-medium);
		border: solid transparent;
		color: var(--text-color);
		border-radius: var(--border-radius);
		/* background-color: var(--secondary-color); */
	}

	#data {
		color: var(--accent-color);
		white-space: pre-wrap;
	}
</style>
