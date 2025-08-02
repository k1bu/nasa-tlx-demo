<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import PairwiseComparison from '$lib/PairwiseComparison.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let user = data.user;

	// NASA TLX dimensions with official descriptions and labels
	const dimensions = [
		{
			key: 'mental',
			label: 'Mental Demand',
			description: 'How mentally demanding was the task?',
			lowLabel: 'Very Low',
			highLabel: 'Very High'
		},
		{
			key: 'physical',
			label: 'Physical Demand',
			description: 'How physically demanding was the task?',
			lowLabel: 'Very Low',
			highLabel: 'Very High'
		},
		{
			key: 'temporal',
			label: 'Temporal Demand',
			description: 'How hurried or rushed was the pace of the task?',
			lowLabel: 'Very Low',
			highLabel: 'Very High'
		},
		{
			key: 'performance',
			label: 'Performance',
			description: 'How successful were you in accomplishing what you were asked to do?',
			lowLabel: 'Perfect',
			highLabel: 'Failure'
		},
		{
			key: 'effort',
			label: 'Effort',
			description: 'How hard did you have to work to accomplish your level of performance?',
			lowLabel: 'Very Low',
			highLabel: 'Very High'
		},
		{
			key: 'frustration',
			label: 'Frustration',
			description: 'How insecure, discouraged, irritated, stressed, and annoyed were you?',
			lowLabel: 'Very Low',
			highLabel: 'Very High'
		}
	];

	let form: Record<string, number> = {
		mental: 50,
		physical: 50,
		temporal: 50,
		performance: 50,
		effort: 50,
		frustration: 50
	};

	let task = '';
	let showPairwise = false;
	let pairwiseWeights: any = null;
	let submittedResult: any = null;
	let submitting = false;

	function handleSubmit() {
		showPairwise = true;
	}
</script>

<svelte:head>
	<title>TLX Assessment - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<DashboardNav {user} />

	<!-- Main content -->
	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
			<h2 class="mb-2 text-center text-2xl font-bold">NASA Task Load Index (TLX)</h2>
			<p class="mb-6 text-center text-gray-600">
				Please rate your experience across six dimensions of workload. This helps us understand
				the mental and physical demands of your activities.
			</p>

			{#if !showPairwise}
				<form on:submit|preventDefault={handleSubmit}>
					<div class="mb-6">
						<label class="mb-1 block text-lg font-semibold" for="task">Task</label>
						<input
							id="task"
							type="text"
							class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
							placeholder="Describe the task you are evaluating..."
							bind:value={task}
							required
						/>
					</div>
					<div class="space-y-8">
						{#each dimensions as dim}
							<div>
								<label class="mb-1 block text-lg font-semibold" for={dim.key}>{dim.label}</label>
								<div class="mb-2 text-sm text-gray-500">{dim.description}</div>
								<div class="flex items-center gap-4">
									<span class="text-xs text-gray-400">{dim.lowLabel}</span>
									<input
										id={dim.key}
										type="range"
										min="0"
										max="100"
										bind:value={form[dim.key]}
										class="flex-1 accent-red-600"
									/>
									<span class="text-xs text-gray-400">{dim.highLabel}</span>
									<span class="ml-2 w-10 text-right font-mono text-red-700">{form[dim.key]}</span>
								</div>
							</div>
						{/each}
					</div>
					<button
						type="submit"
						class="mt-8 w-full rounded bg-red-600 px-4 py-2 font-bold text-white shadow hover:bg-red-700"
					>
						Submit
					</button>
				</form>
			{:else}
				<PairwiseComparison
					{dimensions}
					on:complete={async (e) => {
						if (submitting) return;
						submitting = true;
						pairwiseWeights = e.detail.weights;
						// Submit to backend
						const response = await fetch('/api/tlx', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								task,
								form,
								weights: pairwiseWeights
							})
						});
						if (response.ok) {
							submittedResult = await response.json();
							showPairwise = false;
						} else {
							alert('Failed to submit results.');
						}
						submitting = false;
					}}
					on:back={() => (showPairwise = false)}
				/>
			{/if}

			{#if submittedResult}
				<div class="mx-auto mt-10 max-w-2xl rounded-lg border border-green-200 bg-green-50 p-6">
					<h2 class="mb-2 text-xl font-bold text-green-800">Submission Successful!</h2>
					<p class="mb-2"><strong>Task:</strong> {submittedResult.task}</p>
					<h3 class="mt-4 mb-2 font-semibold">TLX Ratings:</h3>
					<ul class="mb-2">
						<li>Mental Demand: {submittedResult.mental}</li>
						<li>Physical Demand: {submittedResult.physical}</li>
						<li>Temporal Demand: {submittedResult.temporal}</li>
						<li>Performance: {submittedResult.performance}</li>
						<li>Effort: {submittedResult.effort}</li>
						<li>Frustration: {submittedResult.frustration}</li>
					</ul>
					{#if submittedResult.mentalWeight !== null}
						<h3 class="mt-4 mb-2 font-semibold">Pairwise Weights:</h3>
						<ul>
							<li>Mental Demand: {submittedResult.mentalWeight}</li>
							<li>Physical Demand: {submittedResult.physicalWeight}</li>
							<li>Temporal Demand: {submittedResult.temporalWeight}</li>
							<li>Performance: {submittedResult.performanceWeight}</li>
							<li>Effort: {submittedResult.effortWeight}</li>
							<li>Frustration: {submittedResult.frustrationWeight}</li>
						</ul>
					{/if}
					<div class="mt-4">
						<button
							on:click={() => goto('/dashboard')}
							class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div> 