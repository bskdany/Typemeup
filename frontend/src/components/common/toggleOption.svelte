<script lang="ts">
	const { title, defaultValue, onChange }: { title: string; defaultValue: boolean; onChange: (value: boolean) => void } = $props();
	let isChecked = $state(defaultValue);
</script>

<label class="toggle">
	<span class="toggle-title">{title}</span>
	<input
		type="checkbox"
		checked={isChecked}
		onchange={() => {
			isChecked = !isChecked;
			onChange(isChecked);
		}}
	/>
	<span class="slider"></span>
</label>

<style>
	.toggle {
		display: inline-flex;
		width: 100%;
		justify-content: space-around;
		align-items: center;
		cursor: pointer;
	}

	.toggle-title {
		margin-right: 8px;
	}

	input {
		display: none;
	}

	.slider {
		position: relative;
		width: 40px;
		height: 20px;
		background-color: var(--primary-color);
		border-radius: 20px;
		transition: 0.4s;
	}

	.slider::before {
		content: '';
		position: absolute;
		height: 16px;
		width: 16px;
		left: 2px;
		bottom: 2px;
		background-color: white;
		border-radius: 50%;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: var(--accent-color);
	}

	input:checked + .slider::before {
		transform: translateX(20px);
	}
</style>
