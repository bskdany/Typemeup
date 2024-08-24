<script>
	import { marked } from 'marked';
	import about from '../../../static/about.md?raw';
</script>

<div id="about">
	{@html marked(about)}
</div>

<style>
	#about :global(table) {
		border-collapse: collapse;
	}

	#about :global(th),
	#about :global(td) {
		border-collapse: collapse;
		border: 1px solid var(--primary-color);
		padding: 5px;
	}
</style>
