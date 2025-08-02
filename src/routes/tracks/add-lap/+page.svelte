<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let tracks: any[] = [];
	let loading = true;
	let submitting = false;
	let submitted = false;
	let error = '';

	let form = {
		trackId: '',
		lapTime: '',
		lapNumber: 1,
		sessionDate: new Date().toISOString().split('T')[0],
		sessionType: 'practice',
		environment: 'real',
		carClass: '',
		weather: '',
		trackConditions: '',
		notes: ''
	};

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

	async function handleSubmit() {
		try {
			submitting = true;
			error = '';

			// Validate form
			if (!form.trackId) {
				throw new Error('Please select a track');
			}
			if (!form.lapTime) {
				throw new Error('Please enter a lap time');
			}

			// Convert lap time to seconds
			const lapTimeInSeconds = convertLapTimeToSeconds(form.lapTime);

			const response = await fetch('/api/lap-times', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					trackId: parseInt(form.trackId),
					lapTime: lapTimeInSeconds,
					lapNumber: form.lapNumber,
					sessionDate: form.sessionDate,
					sessionType: form.sessionType,
					environment: form.environment,
					carClass: form.carClass || null,
					weather: form.weather || null,
					trackConditions: form.trackConditions || null,
					notes: form.notes || null
				})
			});

			if (response.ok) {
				submitted = true;
			} else {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save lap time');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			submitting = false;
		}
	}

	function convertLapTimeToSeconds(lapTime: string): number {
		// Handle format like "1:23.456" or "83.456"
		const parts = lapTime.split(':');
		if (parts.length === 2) {
			const minutes = parseInt(parts[0]);
			const seconds = parseFloat(parts[1]);
			return minutes * 60 + seconds;
		} else {
			return parseFloat(lapTime);
		}
	}

	function formatLapTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = (seconds % 60).toFixed(3);
		return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
	}

	function resetForm() {
		submitted = false;
		error = '';
		form = {
			trackId: '',
			lapTime: '',
			lapNumber: 1,
			sessionDate: new Date().toISOString().split('T')[0],
			sessionType: 'practice',
			environment: 'real',
			carClass: '',
			weather: '',
			trackConditions: '',
			notes: ''
		};
	}
</script>

<svelte:head>
	<title>Add Lap Time - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<button
				on:click={() => goto('/tracks')}
				class="mb-4 text-blue-600 hover:text-blue-800"
			>
				← Back to Tracks
			</button>
			<h1 class="text-3xl font-bold text-gray-900">Add Lap Time</h1>
			<p class="mt-2 text-gray-600">
				Record your lap time and session details for performance tracking.
			</p>
		</div>

		{#if submitted}
			<!-- Success Message -->
			<div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
				<div class="flex items-center">
					<div class="mr-3 text-2xl text-green-400">✅</div>
					<div>
						<h3 class="text-lg font-medium text-green-800">Lap Time Recorded Successfully!</h3>
						<p class="text-green-700">
							Your lap time has been saved and is now available in your performance analytics.
						</p>
					</div>
				</div>
				<div class="mt-4 flex space-x-4">
					<button
						on:click={resetForm}
						class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Add Another Lap
					</button>
					<button
						on:click={() => goto('/tracks')}
						class="rounded border border-green-600 px-4 py-2 text-green-600 hover:bg-green-50"
					>
						Back to Tracks
					</button>
				</div>
			</div>
		{:else}
			<!-- Form -->
			<div class="rounded-lg bg-white p-6 shadow">
				{#if error}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
						<div class="flex items-center">
							<div class="mr-2 text-xl text-red-400">⚠️</div>
							<div class="text-red-800">{error}</div>
						</div>
					</div>
				{/if}

				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<!-- Track Selection -->
					<div>
						<label for="trackId" class="mb-2 block text-sm font-medium text-gray-700">
							Track *
						</label>
						<select
							id="trackId"
							bind:value={form.trackId}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							required
						>
							<option value="">Select a track...</option>
							{#each tracks as track}
								<option value={track.id}>{track.name} - {track.location}</option>
							{/each}
						</select>
					</div>

					<!-- Lap Time and Number -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="lapTime" class="mb-2 block text-sm font-medium text-gray-700">
								Lap Time *
							</label>
							<input
								type="text"
								id="lapTime"
								bind:value={form.lapTime}
								placeholder="1:23.456 or 83.456"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
								required
							/>
							<p class="mt-1 text-xs text-gray-500">
								Format: MM:SS.sss or SS.sss (seconds)
							</p>
						</div>

						<div>
							<label for="lapNumber" class="mb-2 block text-sm font-medium text-gray-700">
								Lap Number
							</label>
							<input
								type="number"
								id="lapNumber"
								bind:value={form.lapNumber}
								min="1"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<!-- Session Details -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label for="sessionDate" class="mb-2 block text-sm font-medium text-gray-700">
								Session Date
							</label>
							<input
								type="date"
								id="sessionDate"
								bind:value={form.sessionDate}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							/>
						</div>

						<div>
							<label for="sessionType" class="mb-2 block text-sm font-medium text-gray-700">
								Session Type
							</label>
							<select
								id="sessionType"
								bind:value={form.sessionType}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="practice">Practice</option>
								<option value="qualifying">Qualifying</option>
								<option value="race">Race</option>
								<option value="testing">Testing</option>
							</select>
						</div>

						<div>
							<label for="environment" class="mb-2 block text-sm font-medium text-gray-700">
								Environment
							</label>
							<select
								id="environment"
								bind:value={form.environment}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="real">Real Track</option>
								<option value="sim">Simulator</option>
							</select>
						</div>
					</div>

					<!-- Additional Context -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label for="carClass" class="mb-2 block text-sm font-medium text-gray-700">
								Car Class
							</label>
							<input
								type="text"
								id="carClass"
								bind:value={form.carClass}
								placeholder="e.g., GT3, Spec Miata"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							/>
						</div>

						<div>
							<label for="weather" class="mb-2 block text-sm font-medium text-gray-700">
								Weather
							</label>
							<select
								id="weather"
								bind:value={form.weather}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="">Select weather...</option>
								<option value="dry">Dry</option>
								<option value="wet">Wet</option>
								<option value="damp">Damp</option>
								<option value="mixed">Mixed</option>
							</select>
						</div>

						<div>
							<label for="trackConditions" class="mb-2 block text-sm font-medium text-gray-700">
								Track Conditions
							</label>
							<select
								id="trackConditions"
								bind:value={form.trackConditions}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="">Select conditions...</option>
								<option value="green">Green</option>
								<option value="rubbered">Rubbered In</option>
								<option value="dirty">Dirty</option>
								<option value="cold">Cold</option>
								<option value="hot">Hot</option>
							</select>
						</div>
					</div>

					<!-- Notes -->
					<div>
						<label for="notes" class="mb-2 block text-sm font-medium text-gray-700">
							Notes (Optional)
						</label>
						<textarea
							id="notes"
							bind:value={form.notes}
							rows="3"
							placeholder="Any additional notes about this lap or session..."
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
						></textarea>
					</div>

					<!-- Submit Button -->
					<div class="flex justify-end space-x-4">
						<button
							type="button"
							on:click={() => goto('/tracks')}
							class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{submitting ? 'Saving...' : 'Save Lap Time'}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</main>
</div> 