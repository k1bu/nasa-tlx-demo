<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let track: any = null;
	let turns: any[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		await loadTrackAndTurns();
	});

	async function loadTrackAndTurns() {
		try {
			loading = true;

			// Load track data
			const trackResponse = await fetch(`/api/tracks/${data.trackId}`);
			if (trackResponse.ok) {
				const trackData = await trackResponse.json();
				track = trackData.track;
			}

			// Load turns data
			const turnsResponse = await fetch(`/api/tracks/${data.trackId}/turns`);
			if (turnsResponse.ok) {
				const turnsData = await turnsResponse.json();
				turns = turnsData.turns;
			} else {
				error = 'Failed to load turn data';
			}
		} catch (err) {
			error = 'Failed to load data';
			console.error('Load error:', err);
		} finally {
			loading = false;
		}
	}

	function getDifficultyColor(difficulty: number) {
		if (difficulty >= 8) return 'bg-red-100 text-red-800';
		if (difficulty >= 6) return 'bg-orange-100 text-orange-800';
		if (difficulty >= 4) return 'bg-yellow-100 text-yellow-800';
		return 'bg-green-100 text-green-800';
	}

	function getTurnTypeIcon(turnType: string) {
		switch (turnType) {
			case 'hairpin':
				return '🔄';
			case 'chicane':
				return '⚡';
			case 'esses':
				return '〰️';
			case 'sweeper':
				return '🌊';
			case 'kink':
				return '↪️';
			case 'blind':
				return '👁️';
			default:
				return '🏁';
		}
	}
</script>

<svelte:head>
	<title>Turn Insights - {track?.name || 'Track'} - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<button
				on:click={() => goto(`/tracks/${data.trackId}`)}
				class="mb-4 text-blue-600 hover:text-blue-800"
			>
				← Back to Track Details
			</button>

			{#if loading}
				<div class="animate-pulse">
					<div class="mb-2 h-8 w-64 rounded bg-gray-200"></div>
					<div class="h-4 w-96 rounded bg-gray-200"></div>
				</div>
			{:else if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<div class="text-red-700">{error}</div>
					<button
						on:click={loadTrackAndTurns}
						class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
					>
						Try again
					</button>
				</div>
			{:else if track}
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Turn-by-Turn Mental Performance</h1>
					<p class="mt-2 text-gray-600">{track.name} - Psychological Strategies & Insights</p>
				</div>
			{/if}
		</div>

		{#if track && turns.length > 0}
			<!-- Turn Insights Grid -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each turns as turn}
					<div class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
						<!-- Turn Header -->
						<div class="mb-4 flex items-start justify-between">
							<div>
								<div class="mb-2 flex items-center gap-2">
									<span class="text-2xl">{getTurnTypeIcon(turn.turnType)}</span>
									<h3 class="text-xl font-semibold text-gray-900">
										Turn {turn.turnNumber}: {turn.turnName}
									</h3>
								</div>
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(turn.difficulty)}`}
								>
									Difficulty: {turn.difficulty}/10
								</span>
							</div>
						</div>

						<!-- Turn Description -->
						<div class="mb-4">
							<h4 class="mb-1 text-sm font-medium text-gray-500">Overview</h4>
							<p class="text-gray-900">{turn.description}</p>
						</div>

						<!-- Mental Performance Grid -->
						<div class="grid grid-cols-1 gap-4">
							<!-- Mental Challenges -->
							<div class="rounded-lg bg-red-50 p-4">
								<h4 class="mb-2 text-sm font-medium text-red-800">🧠 Mental Challenges</h4>
								<p class="text-sm text-red-700">{turn.mentalChallenges}</p>
							</div>

							<!-- Pressure Points -->
							<div class="rounded-lg bg-orange-50 p-4">
								<h4 class="mb-2 text-sm font-medium text-orange-800">⚠️ Pressure Points</h4>
								<p class="text-sm text-orange-700">{turn.pressurePoints}</p>
							</div>

							<!-- Confidence Builders -->
							<div class="rounded-lg bg-green-50 p-4">
								<h4 class="mb-2 text-sm font-medium text-green-800">💪 Confidence Builders</h4>
								<p class="text-sm text-green-700">{turn.confidenceBuilders}</p>
							</div>

							<!-- Common Mistakes -->
							<div class="rounded-lg bg-blue-50 p-4">
								<h4 class="mb-2 text-sm font-medium text-blue-800">🚫 Common Mistakes</h4>
								<p class="text-sm text-blue-700">{turn.commonMistakes}</p>
							</div>
						</div>

						<!-- Action Button -->
						<div class="mt-4 border-t border-gray-200 pt-4">
							<button
								on:click={() => goto(`/tlx?trackId=${track.id}&turnNumber=${turn.turnNumber}`)}
								class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								📊 Take TLX Assessment for This Turn
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Summary Section -->
			<div class="mt-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">🧠 Psychological Summary</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-lg bg-gray-50 p-4 text-center">
						<div class="text-2xl font-bold text-red-600">
							{turns.filter((t) => t.difficulty >= 8).length}
						</div>
						<div class="text-sm text-gray-600">High Difficulty Turns</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-4 text-center">
						<div class="text-2xl font-bold text-blue-600">{turns.length}</div>
						<div class="text-sm text-gray-600">Total Turns Analyzed</div>
					</div>
					<div class="rounded-lg bg-gray-50 p-4 text-center">
						<div class="text-2xl font-bold text-green-600">
							{Math.round(turns.reduce((sum, t) => sum + t.difficulty, 0) / turns.length)}
						</div>
						<div class="text-sm text-gray-600">Average Difficulty</div>
					</div>
				</div>
			</div>
		{:else if track && turns.length === 0}
			<!-- No Turns Available -->
			<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<div class="mb-4 text-4xl">🧠</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Turn Insights Not Available</h3>
				<p class="mb-4 text-gray-600">
					Turn-by-turn mental performance insights haven't been added for this track yet.
				</p>
				<p class="text-sm text-gray-500">
					Check back soon for detailed psychological strategies and performance tips!
				</p>
			</div>
		{/if}
	</main>
</div>
