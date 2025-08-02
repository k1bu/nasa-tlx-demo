<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let pressureResult = data.pressureResult;

	// Pressure dimension labels
	const pressureDimensions = [
		{ key: 'pressureAwareness', label: 'Pressure Awareness', description: 'How aware are you of pressure in different situations?' },
		{ key: 'pressureResponse', label: 'Pressure Response', description: 'How do you typically respond to pressure?' },
		{ key: 'pressureManagement', label: 'Pressure Management', description: 'How well do you manage pressure during performance?' },
		{ key: 'pressureImpact', label: 'Pressure Impact', description: 'How does pressure impact your performance?' },
		{ key: 'pressureRecovery', label: 'Pressure Recovery', description: 'How quickly do you recover from pressure situations?' },
		{ key: 'pressureEnvironment', label: 'Pressure Environment', description: 'How do you handle pressure in different environments?' },
		{ key: 'pressureCommunication', label: 'Pressure Communication', description: 'How do you communicate under pressure?' },
		{ key: 'pressureLearning', label: 'Pressure Learning', description: 'How do you learn from pressure situations?' }
	];
</script>

<svelte:head>
	<title>Pressure Assessment Results - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<button
				on:click={() => goto('/assessments')}
				class="mb-4 flex items-center text-blue-600 hover:text-blue-800"
			>
				← Back to Assessments
			</button>
			<h1 class="text-3xl font-bold text-gray-900">Pressure Assessment Results</h1>
			<p class="text-gray-600">Your pressure handling and stress management profile</p>
		</div>

		{#if pressureResult}
			<div class="space-y-6">
				<!-- Assessment Information -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Assessment Information</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm font-medium text-gray-500">Assessment Date</label>
							<p class="text-lg text-gray-900">{pressureResult.assessmentDate}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Overall Score</label>
							<p class="text-lg font-semibold text-purple-600">
								{Math.round((Object.values(pressureResult).filter(v => typeof v === 'number' && v > 0 && v <= 10).reduce((a, b) => a + b, 0) / 8) * 10) / 10}/10
							</p>
						</div>
					</div>
				</div>

				<!-- Dimension Scores -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Pressure Management Dimensions</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						{#each pressureDimensions as dimension}
							{@const score = pressureResult[dimension.key]}
							{@const percentage = (score / 10) * 100}
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<h3 class="font-medium text-gray-900">{dimension.label}</h3>
									<span class="text-lg font-semibold text-purple-600">{score}/10</span>
								</div>
								<p class="text-sm text-gray-600">{dimension.description}</p>
								<div class="w-full bg-gray-200 rounded-full h-2">
									<div class="bg-purple-600 h-2 rounded-full" style="width: {percentage}%"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Insights -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Pressure Management Insights</h2>
					<div class="space-y-4">
						{#if pressureResult.pressureAwareness >= 7}
							<div class="flex items-start space-x-3">
								<span class="text-green-500 text-xl">✅</span>
								<div>
									<h4 class="font-medium text-gray-900">High Pressure Awareness</h4>
									<p class="text-gray-600">You have excellent awareness of pressure situations, which is crucial for managing them effectively.</p>
								</div>
							</div>
						{/if}
						{#if pressureResult.pressureManagement >= 7}
							<div class="flex items-start space-x-3">
								<span class="text-green-500 text-xl">✅</span>
								<div>
									<h4 class="font-medium text-gray-900">Strong Pressure Management</h4>
									<p class="text-gray-600">You handle pressure well during performance, maintaining focus and composure.</p>
								</div>
							</div>
						{/if}
						{#if pressureResult.pressureRecovery >= 7}
							<div class="flex items-start space-x-3">
								<span class="text-green-500 text-xl">✅</span>
								<div>
									<h4 class="font-medium text-gray-900">Quick Pressure Recovery</h4>
									<p class="text-gray-600">You recover quickly from pressure situations, which helps maintain consistent performance.</p>
								</div>
							</div>
						{/if}
						{#if pressureResult.pressureResponse < 5}
							<div class="flex items-start space-x-3">
								<span class="text-yellow-500 text-xl">⚠️</span>
								<div>
									<h4 class="font-medium text-gray-900">Pressure Response Development</h4>
									<p class="text-gray-600">Consider developing strategies to improve your initial response to pressure situations.</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Recommendations -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Recommendations</h2>
					<div class="space-y-4">
						<div class="flex items-start space-x-3">
							<span class="text-blue-500 text-xl">💡</span>
							<div>
								<h4 class="font-medium text-gray-900">Breathing Techniques</h4>
								<p class="text-gray-600">Practice deep breathing exercises to help manage pressure during racing situations.</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<span class="text-blue-500 text-xl">💡</span>
							<div>
								<h4 class="font-medium text-gray-900">Pre-Race Routine</h4>
								<p class="text-gray-600">Develop a consistent pre-race routine to help you enter pressure situations with confidence.</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<span class="text-blue-500 text-xl">💡</span>
							<div>
								<h4 class="font-medium text-gray-900">Mental Rehearsal</h4>
								<p class="text-gray-600">Use visualization techniques to mentally prepare for high-pressure scenarios.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<div class="mb-4 text-6xl">🎯</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">No Pressure Assessment Results Available</h2>
				<p class="mb-6 text-gray-600">
					Pressure Assessment has not been completed yet.
				</p>
				<button
					on:click={() => goto('/assessments/pressure')}
					class="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
				>
					Start Pressure Assessment
				</button>
			</div>
		{/if}
	</main>
</div> 