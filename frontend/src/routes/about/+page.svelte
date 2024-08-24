<script>
	import { marked } from 'marked';
	import about from '../../../static/about.md?raw';
</script>

<div>
	{@html marked(about)}
</div>
