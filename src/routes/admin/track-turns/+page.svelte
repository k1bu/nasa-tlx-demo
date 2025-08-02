<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let tracks: any[] = [];
	let selectedTrack: any = null;
	let turns: any[] = [];
	let loading = true;
	let error = '';
	let success = '';

	onMount(async () => {
		await loadTracks();
	});

	async function loadTracks() {
		try {
			loading = true;
			const response = await fetch('/api/tracks');
			if (response.ok) {
				const data = await response.json();
				tracks = data.tracks;
			}
		} catch (err) {
			error = 'Failed to load tracks';
		} finally {
			loading = false;
		}
	}

	async function loadTurns(trackId: number) {
		try {
			const response = await fetch(`/api/tracks/${trackId}/turns`);
			if (response.ok) {
				const data = await response.json();
				turns = data.turns;
			} else {
				turns = [];
			}
		} catch (err) {
			turns = [];
		}
	}

	async function selectTrack(track: any) {
		selectedTrack = track;
		await loadTurns(track.id);
	}

	async function addVirTurns() {
		if (!selectedTrack) return;

		try {
			const response = await fetch('/api/admin/track-turns/vir', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ trackId: selectedTrack.id })
			});

			if (response.ok) {
				success = 'VIR turns added successfully!';
				await loadTurns(selectedTrack.id);
			} else {
				const result = await response.json();
				error = result.error || 'Failed to add VIR turns';
			}
		} catch (err) {
			error = 'Failed to add VIR turns';
		}
	}

	function clearMessages() {
		error = '';
		success = '';
	}
</script>

<svelte:head>
	<title>Track Turns Management - MindLap Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Track Turns Management</h1>
			<p class="mt-2 text-gray-600">Manage turn-by-turn mental performance insights</p>
		</div>

		<!-- Messages -->
		{#if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="text-red-700">{error}</div>
				<button
					on:click={clearMessages}
					class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
				>
					Dismiss
				</button>
			</div>
		{/if}

		{#if success}
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="text-green-700">{success}</div>
				<button
					on:click={clearMessages}
					class="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
				>
					Dismiss
				</button>
			</div>
		{/if}

		{#if loading}
			<div class="animate-pulse">
				<div class="h-8 w-64 bg-gray-200 rounded mb-4"></div>
				<div class="h-4 w-96 bg-gray-200 rounded"></div>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<!-- Track Selection -->
				<div class="lg:col-span-1">
					<div class="rounded-lg bg-white p-6 shadow">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">Select Track</h2>
						<div class="space-y-2">
							{#each tracks as track}
								<button
									on:click={() => selectTrack(track)}
									class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors {selectedTrack?.id === track.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
								>
									<div class="font-medium text-gray-900">{track.name}</div>
									<div class="text-sm text-gray-600">{track.location}</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Turn Management -->
				<div class="lg:col-span-2">
					{#if selectedTrack}
						<div class="rounded-lg bg-white p-6 shadow">
							<div class="flex items-center justify-between mb-6">
								<div>
									<h2 class="text-xl font-semibold text-gray-900">{selectedTrack.name}</h2>
									<p class="text-gray-600">Turn-by-turn insights</p>
								</div>
								{#if selectedTrack.name === 'Virginia International Raceway' && turns.length === 0}
									<button
										on:click={addVirTurns}
										class="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
									>
										Add VIR Turns
									</button>
								{/if}
							</div>

							{#if turns.length > 0}
								<div class="grid grid-cols-1 gap-4">
									{#each turns as turn}
										<div class="border border-gray-200 rounded-lg p-4">
											<div class="flex items-center justify-between mb-2">
												<h3 class="font-medium text-gray-900">
													Turn {turn.turnNumber}: {turn.turnName}
												</h3>
												<span class="text-sm text-gray-500">Difficulty: {turn.difficulty}/10</span>
											</div>
											<p class="text-sm text-gray-600 mb-2">{turn.description}</p>
											<div class="grid grid-cols-2 gap-2 text-xs">
												<div>
													<span class="font-medium text-red-600">Mental Challenges:</span>
													<p class="text-gray-600">{turn.mentalChallenges}</p>
												</div>
												<div>
													<span class="font-medium text-green-600">Confidence Builders:</span>
													<p class="text-gray-600">{turn.confidenceBuilders}</p>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-8 text-gray-500">
									<div class="text-4xl mb-4">🏁</div>
									<p class="text-lg font-medium">No turns added yet</p>
									<p class="text-sm">
										{#if selectedTrack.name === 'Virginia International Raceway'}
											Click "Add VIR Turns" to add the comprehensive turn-by-turn mental performance insights.
										{:else}
											Turn insights haven't been added for this track yet.
										{/if}
									</p>
								</div>
							{/if}
						</div>
					{:else}
						<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
							<div class="text-4xl mb-4">🏁</div>
							<h3 class="text-lg font-medium text-gray-900 mb-2">Select a Track</h3>
							<p class="text-gray-600">Choose a track from the list to view and manage its turn insights.</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div> 