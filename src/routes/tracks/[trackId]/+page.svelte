<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let track: any = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		await loadTrack();
	});

	async function loadTrack() {
		try {
			loading = true;
			const response = await fetch(`/api/tracks/${data.trackId}`);
			if (response.ok) {
				const data = await response.json();
				track = data.track;
			} else {
				error = 'Failed to load track';
			}
		} catch (err) {
			error = 'Failed to load track';
			console.error('Load track error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{track?.name || 'Track Details'} - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<button on:click={() => goto('/tracks')} class="mb-4 text-blue-600 hover:text-blue-800">
				← Back to Tracks
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
						on:click={loadTrack}
						class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
					>
						Try again
					</button>
				</div>
			{:else if track}
				<div>
					<h1 class="text-3xl font-bold text-gray-900">{track.name}</h1>
					<p class="mt-2 text-gray-600">{track.location}, {track.country}</p>
				</div>
			{/if}
		</div>

		{#if track}
			<!-- Track Image -->
			<div class="mb-8">
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Track Layout</h2>
					{#if track.imageUrl}
						<div class="flex justify-center">
							<img
								src={track.imageUrl}
								alt="Track layout for {track.name}"
								class="h-auto max-w-full rounded-lg shadow-md"
								style="max-height: 500px;"
							/>
						</div>
					{:else}
						<div class="flex items-center justify-center py-12 text-gray-500">
							<div class="text-center">
								<div class="mb-4 text-4xl">🏁</div>
								<p class="text-lg font-medium">Track layout image not available</p>
								<p class="text-sm">Track layout images will be added by administrators</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
			<!-- Track Information -->
			<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<!-- Track Details -->
				<div class="lg:col-span-2">
					<div class="rounded-lg bg-white p-6 shadow">
						<h2 class="mb-4 text-xl font-semibold text-gray-900">Track Information</h2>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label class="text-sm font-medium text-gray-500">Circuit Length</label>
								<p class="text-lg font-semibold text-gray-900">{track.circuitLength} miles</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Track Type</label>
								<p class="text-lg font-semibold text-gray-900 capitalize">{track.trackType}</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Surface</label>
								<p class="text-lg font-semibold text-gray-900 capitalize">{track.surface}</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Status</label>
								<p class="text-lg font-semibold text-gray-900">
									<span
										class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
									>
										Active
									</span>
								</p>
							</div>
						</div>

						{#if track.description}
							<div class="mt-6">
								<label class="text-sm font-medium text-gray-500">Description</label>
								<p class="mt-1 text-gray-900">{track.description}</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="space-y-4">
					<div class="rounded-lg bg-white p-6 shadow">
						<h3 class="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
						<div class="space-y-3">
							<button
								on:click={() => goto('/tracks/add-lap')}
								class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
							>
								Add Lap Time
							</button>
							<button
								on:click={() => goto(`/tracks/${track.id}/performance`)}
								class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							>
								View Performance
							</button>
							<button
								on:click={() => goto(`/tracks/${track.id}/insights`)}
								class="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
							>
								Insights
							</button>
						</div>
					</div>

					<!-- Track Stats -->
					<div class="rounded-lg bg-white p-6 shadow">
						<h3 class="mb-4 text-lg font-semibold text-gray-900">Your Stats</h3>
						<div class="space-y-3">
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Sessions</span>
								<span class="font-semibold text-gray-900">0</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Best Lap</span>
								<span class="font-semibold text-gray-900">--</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Avg Lap</span>
								<span class="font-semibold text-gray-900">--</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Sessions (Placeholder) -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">Recent Sessions</h2>
				<div class="py-8 text-center text-gray-500">
					<div class="mb-4 text-4xl">📊</div>
					<p>No sessions recorded yet</p>
					<p class="text-sm">Add your first lap time to see your performance data</p>
				</div>
			</div>
		{/if}
	</main>
</div>
