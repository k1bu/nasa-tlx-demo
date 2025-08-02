<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let tracks: any[] = [];
	let loading = true;
	let error = '';

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
			} else {
				error = 'Failed to load tracks';
			}
		} catch (err) {
			error = 'Failed to load tracks';
			console.error('Load tracks error:', err);
		} finally {
			loading = false;
		}
	}

	function formatLapTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = (seconds % 60).toFixed(3);
		return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
	}
</script>

<svelte:head>
	<title>Tracks & Performance - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Tracks & Performance</h1>
			<p class="mt-2 text-gray-600">
				Track your lap times, analyze turn performance, and get mental performance insights for each
				track.
			</p>
		</div>

		<!-- Quick Actions -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<button
				on:click={() => goto('/tracks/add-lap')}
				class="flex items-center justify-center rounded-lg bg-blue-600 p-4 text-white transition-colors hover:bg-blue-700"
			>
				<div class="text-center">
					<div class="mb-2 text-2xl">⏱️</div>
					<div class="font-medium">Add Lap Time</div>
					<div class="text-sm opacity-90">Record new session</div>
				</div>
			</button>

			<button
				on:click={() => goto('/tracks/performance')}
				class="flex items-center justify-center rounded-lg bg-green-600 p-4 text-white transition-colors hover:bg-green-700"
			>
				<div class="text-center">
					<div class="mb-2 text-2xl">📈</div>
					<div class="font-medium">Performance Analytics</div>
					<div class="text-sm opacity-90">View trends & insights</div>
				</div>
			</button>

			<button
				on:click={() => goto('/tracks/compare')}
				class="flex items-center justify-center rounded-lg bg-purple-600 p-4 text-white transition-colors hover:bg-purple-700"
			>
				<div class="text-center">
					<div class="mb-2 text-2xl">🔄</div>
					<div class="font-medium">Compare Sessions</div>
					<div class="text-sm opacity-90">Real vs Sim data</div>
				</div>
			</button>

			<button
				on:click={() => goto('/tracks/insights')}
				class="flex items-center justify-center rounded-lg bg-orange-600 p-4 text-white transition-colors hover:bg-orange-700"
			>
				<div class="text-center">
					<div class="mb-2 text-2xl">🧠</div>
					<div class="font-medium">Mental Insights</div>
					<div class="text-sm opacity-90">Turn psychology tips</div>
				</div>
			</button>
		</div>

		<!-- Tracks Grid -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Available Tracks</h2>

			{#if loading}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each Array(6) as _}
						<div class="animate-pulse rounded-lg bg-white p-6 shadow">
							<div class="mb-4 h-4 rounded bg-gray-200"></div>
							<div class="mb-2 h-3 rounded bg-gray-200"></div>
							<div class="h-3 w-2/3 rounded bg-gray-200"></div>
						</div>
					{/each}
				</div>
			{:else if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<div class="text-red-700">{error}</div>
					<button
						on:click={loadTracks}
						class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
					>
						Try again
					</button>
				</div>
			{:else if tracks.length === 0}
				<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
					<div class="mb-4 text-4xl">🏁</div>
					<h3 class="mb-2 text-lg font-medium text-gray-900">No tracks available</h3>
					<p class="mb-4 text-gray-600">Tracks will be added by administrators. Check back soon!</p>
					{#if user?.role === 'superuser' || user?.role === 'coach'}
						<button
							on:click={() => goto('/admin/tracks')}
							class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							Manage Tracks
						</button>
					{/if}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each tracks as track}
						<div class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
							<div class="mb-4 flex items-start justify-between">
								<div>
									<h3 class="text-lg font-semibold text-gray-900">{track.name}</h3>
									<p class="text-sm text-gray-600">{track.location}</p>
								</div>
								<div class="text-2xl">🏁</div>
							</div>

							<div class="mb-4 space-y-2 text-sm text-gray-600">
								<div class="flex justify-between">
									<span>Length:</span>
									<span>{track.circuitLength} miles</span>
								</div>
								<div class="flex justify-between">
									<span>Type:</span>
									<span class="capitalize">{track.trackType}</span>
								</div>
								<div class="flex justify-between">
									<span>Turns:</span>
									<span>{track.turnCount || 'N/A'}</span>
								</div>
							</div>

							<div class="flex space-x-2">
								<button
									on:click={() => goto(`/tracks/${track.id}`)}
									class="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
								>
									View Details
								</button>
								<button
									on:click={() => goto('/tracks/add-lap')}
									class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									Add Lap
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Recent Performance Summary -->
		<div class="rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Recent Performance</h3>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="text-center">
					<div class="text-2xl font-bold text-blue-600">0</div>
					<div class="text-sm text-gray-600">Sessions This Week</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-green-600">0</div>
					<div class="text-sm text-gray-600">Personal Bests</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-purple-600">0</div>
					<div class="text-sm text-gray-600">Tracks Driven</div>
				</div>
			</div>
		</div>
	</main>
</div>
