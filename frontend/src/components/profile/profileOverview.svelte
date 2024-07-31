<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import type { PastTypingTestResult } from '../../types/interfaces';
	import BubbleContainer from '../common/bubbleContainer.svelte';

	// const { pastTypingTestResult }: { pastTypingTestResult: PastTypingTestResult[] } = $props();
</script>

<BubbleContainer>
	<div>
		Welcome back {userData.username}
	</div>
</BubbleContainer>
