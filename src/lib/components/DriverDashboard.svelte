<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DriverNav from './DriverNav.svelte';

	export let user: { email?: string; role?: string } | null = null;

	interface TLXSubmission {
		id: number;
		task: string;
		createdAt: string;
		mental: number;
		physical: number;
		temporal: number;
		performance: number;
		effort: number;
		frustration: number;
	}

	let tlxSubmissions: TLXSubmission[] = [];
	let loading = true;

	onMount(async () => {
		await loadTLXHistory();
	});

	async function loadTLXHistory() {
		try {
			const response = await fetch('/api/tlx');
			if (response.ok) {
				const data = await response.json();
				tlxSubmissions = data.results || [];
			}
		} catch (error) {
			console.error('Error loading TLX history:', error);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function getTLXScore(submission: TLXSubmission) {
		// Calculate weighted TLX score (simplified)
		const weights = [3, 2, 2, 2, 2, 2]; // Mental demand gets higher weight
		const scores = [
			submission.mental,
			submission.physical,
			submission.temporal,
			submission.performance,
			submission.effort,
			submission.frustration
		];

		const weightedSum = scores.reduce((sum, score, index) => sum + score * weights[index], 0);
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

		return Math.round(weightedSum / totalWeight);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<DriverNav {user} />

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Welcome Section -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">
				Welcome, {user?.email?.split('@')[0]}!
			</h1>
			<p class="text-lg text-gray-600">
				Ready to assess your mental workload? Take a TLX assessment to track your performance.
			</p>
		</div>

		<!-- TLX Action Card -->
		<div class="mb-8 rounded-lg bg-white p-8 shadow-lg">
			<div class="text-center">
				<div class="mb-4 text-6xl">📊</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">Take TLX Assessment</h2>
				<p class="mb-6 text-gray-600">
					Complete a mental workload assessment to track your performance over time.
				</p>
				<button
					on:click={() => goto('/tlx')}
					class="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Start Assessment
				</button>
			</div>
		</div>

		<!-- TLX History Section -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-6">
				<h3 class="text-xl font-semibold text-gray-900">Your TLX History</h3>
				<p class="text-gray-600">Track your mental workload assessments over time</p>
			</div>

			{#if loading}
				<div class="py-8 text-center">
					<div class="text-gray-500">Loading your assessment history...</div>
				</div>
			{:else if tlxSubmissions.length === 0}
				<div class="py-8 text-center">
					<div class="text-gray-500">No TLX assessments completed yet.</div>
					<div class="mt-2 text-sm text-gray-400">
						Complete your first assessment to see your history here.
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					{#each tlxSubmissions as submission}
						<div class="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<div class="mb-2">
										<span class="font-medium text-gray-900">
											{submission.task || 'General Task'}
										</span>
										<span class="ml-2 text-sm text-gray-500">
											{formatDate(submission.createdAt)}
										</span>
									</div>
									<div class="flex flex-wrap gap-2 text-sm text-gray-600">
										<span>Mental: {submission.mental}</span>
										<span>Physical: {submission.physical}</span>
										<span>Temporal: {submission.temporal}</span>
										<span>Performance: {submission.performance}</span>
										<span>Effort: {submission.effort}</span>
										<span>Frustration: {submission.frustration}</span>
									</div>
								</div>
								<div class="ml-4 text-right">
									<div class="text-2xl font-bold text-blue-600">
										{getTLXScore(submission)}
									</div>
									<div class="text-xs text-gray-500">TLX Score</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
</div>
