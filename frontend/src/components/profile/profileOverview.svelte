<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import type { PastTypingTestResult } from '../../types/interfaces';
	import BubbleContainer from '../common/bubbleContainer.svelte';
	import SingleDataContainer from '../common/singleDataContainer.svelte';

	const { pastTypingTestResult }: { pastTypingTestResult: PastTypingTestResult[] } = $props();
</script>

<BubbleContainer>
	<div style="color: var(--text-color);">
		Welcome back {userData.username}!
	</div>
	<div>
		<SingleDataContainer title={'Tests completed'} data={pastTypingTestResult.length} />
	</div>
</BubbleContainer>
