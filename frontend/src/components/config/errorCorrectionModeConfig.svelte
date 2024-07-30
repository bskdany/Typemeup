<script lang="ts">
	import { userData } from '../../userData.svelte';

	let errorCorrectionModes = {
		0: { name: 'Error block', description: 'Need to remove all incorrect letters before continuing' },
		2: { name: 'Error ignore', description: 'Incorrect letters are ignored from being added' },
		3: { name: 'Spacebar skip', description: 'Spacebar skips the word in case of error' },
		4: { name: 'Smart', description: 'Smart error detection mode (recomended)' }
	};
</script>

<div id="container">
	<div id="title">Error Correction Mode</div>

	<div id="content">
		<div id="description">
			<table>
				<tbody>
					{#each Object.entries(errorCorrectionModes) as [modeNumber, { name, description }]}
						<tr style="display: flex; gap: 8px">
							<th style="white-space: nowrap; display: flex;">{name}:</th>
							<td class:selected={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}>{description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div id="choiceSelection">
			{#each Object.entries(errorCorrectionModes) as [modeNumber, { name, description }]}
				<button
					class:selected={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}
					onclick={() => (userData.userTypingConfig.errorCorrectionMode = parseInt(modeNumber))}>{name}</button
				>
			{/each}
		</div>
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		background-color: transparent;
		border: solid transparent;
		border-radius: 10px;
		color: white;
		padding: 15px;
		box-sizing: border-box;
		background-color: #2c2e31;
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
		margin: 10px;
		border-radius: 15px;
		background-color: #171d1f;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* box-sizing: content-box; */
	}

	#title {
		opacity: 80%;
		font-size: 1.5em;
	}

	#description {
		opacity: 60%;
		display: flex;
		flex-direction: row;
	}

	button {
		background-color: #171d1f;
		padding: 15px 10px 15px 10px;
		border: 1px solid transparent;
	}
</style>
