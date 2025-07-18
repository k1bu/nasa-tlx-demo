<script>
	// NASA TLX dimensions
	const dimensions = [
		{
			key: 'mental',
			label: 'Mental Demand',
			description: 'How much mental and perceptual activity was required?'
		},
		{
			key: 'physical',
			label: 'Physical Demand',
			description: 'How much physical activity was required?'
		},
		{
			key: 'temporal',
			label: 'Temporal Demand',
			description: 'How much time pressure did you feel?'
		},
		{
			key: 'performance',
			label: 'Performance',
			description: 'How successful were you in accomplishing what you were asked to do?'
		},
		{
			key: 'effort',
			label: 'Effort',
			description: 'How hard did you have to work to accomplish your level of performance?'
		},
		{
			key: 'frustration',
			label: 'Frustration',
			description: 'How insecure, discouraged, irritated, stressed, and annoyed were you?'
		}
	];

	let form = {
		mental: 50,
		physical: 50,
		temporal: 50,
		performance: 50,
		effort: 50,
		frustration: 50
	};

	let user = '';
	let task = '';

	import PairwiseComparison from '$lib/PairwiseComparison.svelte';

	let showPairwise = false;
	let pairwiseWeights = null;
	let submittedResult = null;
	let submitting = false;

	function handleSubmit() {
		showPairwise = true;
	}
</script>

<div class="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-8 shadow">
	<h1 class="mb-2 text-center text-2xl font-bold">NASA Task Load Index (TLX)</h1>
	<p class="mb-6 text-center text-gray-600">
		Please rate your experience across six dimensions of workload. This helps us understand the
		mental and physical demands of your activities.
	</p>
	{#if !showPairwise}
		<form on:submit|preventDefault={handleSubmit}>
			<div class="mb-6">
				<label class="mb-1 block text-lg font-semibold" for="user">User</label>
				<input
					id="user"
					type="text"
					class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
					placeholder="Enter your name or identifier..."
					bind:value={user}
					required
				/>
			</div>
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
							<span class="text-xs text-gray-400">Low</span>
							<input
								id={dim.key}
								type="range"
								min="0"
								max="100"
								bind:value={form[dim.key]}
								class="flex-1 accent-red-600"
							/>
							<span class="text-xs text-gray-400">High</span>
							<span class="ml-2 w-10 text-right font-mono text-red-700">{form[dim.key]}</span>
						</div>
					</div>
				{/each}
			</div>
			<button
				type="submit"
				class="mt-8 w-full rounded bg-red-600 px-4 py-2 font-bold text-white shadow hover:bg-red-700"
				>Submit</button
			>
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
						user,
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
			<p class="mb-2"><strong>User:</strong> {submittedResult.user}</p>
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
					<li>Mental: {submittedResult.mentalWeight}</li>
					<li>Physical: {submittedResult.physicalWeight}</li>
					<li>Temporal: {submittedResult.temporalWeight}</li>
					<li>Performance: {submittedResult.performanceWeight}</li>
					<li>Effort: {submittedResult.effortWeight}</li>
					<li>Frustration: {submittedResult.frustrationWeight}</li>
				</ul>
			{/if}
		</div>
	{/if}
</div>
