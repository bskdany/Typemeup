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

		width: 100px;
		height: min-content;
		white-space: nowrap;

		background-color: transparent;
		padding: 10px;
		border: solid transparent;
		color: rgb(127, 106, 106);
		border-radius: 10px;
		background-color: #2c2e31;
	}

	#data {
		color: #a8b9e4;
		white-space: pre-wrap;
	}
</style>
