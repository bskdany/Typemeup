<script lang="ts">
	import { userConfig } from '../../userConfig.svelte';

	let configData: number[] = [0, 1, 2, 3];
</script>

<div id="container">
	<div id="title">Error Correction Mode</div>

	<div id="content">
		<div id="description">
			<p>
				<strong>0</strong> need to remove all incorrect letters before continuing<br />
				<strong>1</strong> incorrect letters are not added, thus ignored<br />
				<strong>2</strong> spacebar skips the word in case of an error<br />
				<strong>3</strong> smart error detection mode <strong>(recomended)</strong>
			</p>
		</div>

		<div id="choiceSelection">
			{#each configData as data}
				<button class:selected={userConfig.errorCorrectionMode === data} onclick={() => (userConfig.errorCorrectionMode = data)}>{data}</button>
			{/each}
		</div>
	</div>
</div>

<style>
	#container {
		width: 100%;
		background-color: transparent;
		border: solid transparent;
		border-radius: 10px;
		color: white;
		padding: 15px;
		box-sizing: border-box;
		background-color: #2c2e31;
		max-width: 60%;
	}

	#content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* align-items: center; */
	}

	#choiceSelection {
		background-color: #2c2e31;
		min-width: fit-content;
		height: fit-content;
		/* padding: 10px; */
		margin: 10px;
		border-radius: 15px;
		background-color: #171d1f;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 20px;
		padding-right: 20px;
		box-sizing: content-box;
	}

	#title {
		opacity: 80%;
		font-size: 1.5em;
	}

	#description {
		opacity: 60%;
	}

	.selected {
		color: #a8b9e4;
	}

	button {
		background-color: #171d1f;
		padding: 15px 10px 15px 10px;
		border: 1px solid transparent;
	}

	button.selected {
		border: 1px solid #a8b9e4;
	}
</style>
