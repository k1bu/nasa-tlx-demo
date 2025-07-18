<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let dimensions: { key: string; label: string }[];
	const dispatch = createEventDispatcher();

	// Generate all unique pairs (order doesn't matter)
	let pairs: [number, number][] = [];
	onMount(() => {
		pairs = [];
		for (let i = 0; i < dimensions.length; i++) {
			for (let j = i + 1; j < dimensions.length; j++) {
				pairs.push([i, j]);
			}
		}
	});

	let current = 0;
	let answers: number[] = [];

	function choose(idx: number) {
		answers[current] = idx;
		if (current < pairs.length - 1) {
			current += 1;
		} else {
			// Calculate weights
			const weights = Array(dimensions.length).fill(0);
			for (let k = 0; k < pairs.length; k++) {
				weights[answers[k]] += 1;
			}
			// Emit weights as { [key]: weight }
			const result = Object.fromEntries(dimensions.map((d, i) => [d.key, weights[i]]));
			dispatch('complete', { weights: result });
		}
	}

	function goBack() {
		if (current > 0) {
			current -= 1;
		} else {
			dispatch('back');
		}
	}
</script>

{#if pairs.length}
	<div class="mx-auto mt-10 max-w-xl rounded-lg bg-white p-8 shadow">
		<h2 class="mb-4 text-center text-xl font-bold">
			Pairwise Comparison (Step {current + 1} of {pairs.length})
		</h2>
		<p class="mb-6 text-center text-gray-600">
			For each pair, select which dimension was more important to your workload.
		</p>
		<div class="flex flex-col items-center gap-6">
			<div class="flex gap-8">
				<button
					class="rounded bg-blue-600 px-6 py-2 text-lg font-bold text-white shadow hover:bg-blue-700"
					on:click={() => choose(pairs[current][0])}
				>
					{dimensions[pairs[current][0]].label}
				</button>
				<span class="text-lg font-semibold text-gray-500">vs</span>
				<button
					class="rounded bg-blue-600 px-6 py-2 text-lg font-bold text-white shadow hover:bg-blue-700"
					on:click={() => choose(pairs[current][1])}
				>
					{dimensions[pairs[current][1]].label}
				</button>
			</div>
			<div class="mt-8 flex w-full justify-between">
				<button class="font-semibold text-gray-500 hover:text-gray-700" on:click={goBack}>
					&larr; Back
				</button>
				<span class="text-gray-400">{current + 1} / {pairs.length}</span>
				<span></span>
			</div>
		</div>
	</div>
{/if}
