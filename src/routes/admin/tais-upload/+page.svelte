<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let users = data.users;
	let existingTaisResults = data.existingTaisResults;

	// TAIS dimension labels - 27 dimensions in correct order
	const taisDimensions = [
		{
			key: 'awareness',
			label: 'Awareness',
			description: 'General awareness of surroundings and situations'
		},
		{
			key: 'externalDistractibility',
			label: 'External Distractibility',
			description: 'Susceptibility to external distractions'
		},
		{
			key: 'analyticalConceptual',
			label: 'Analytical/Conceptual',
			description: 'Ability to think analytically and conceptually'
		},
		{
			key: 'internalDistractibility',
			label: 'Internal Distractibility',
			description: 'Susceptibility to internal distractions'
		},
		{
			key: 'actionFocused',
			label: 'Action/Focused',
			description: 'Ability to maintain focus on action-oriented tasks'
		},
		{
			key: 'reducedFlexibility',
			label: 'Reduced Flexibility',
			description: 'Tendency toward rigid thinking patterns'
		},
		{
			key: 'informationProcessing',
			label: 'Information Processing',
			description: 'Speed and efficiency of processing information'
		},
		{
			key: 'orientationToRulesAndRisks',
			label: 'Orientation to Rules and Risks',
			description: 'Attitude toward rules and risk-taking'
		},
		{
			key: 'control',
			label: 'Control',
			description: 'Ability to maintain emotional and behavioral control'
		},
		{
			key: 'selfConfidence',
			label: 'Self-Confidence',
			description: "Level of confidence in one's abilities"
		},
		{
			key: 'physicallyCompetitive',
			label: 'Physically Competitive',
			description: 'Competitive drive in physical activities'
		},
		{
			key: 'decisionMakingStyle',
			label: 'Decision Making Style',
			description: 'Approach to making decisions'
		},
		{
			key: 'extroversion',
			label: 'Extroversion',
			description: 'Outward-oriented personality traits'
		},
		{
			key: 'introversion',
			label: 'Introversion',
			description: 'Inward-oriented personality traits'
		},
		{
			key: 'expressionOfIdeas',
			label: 'Expression of Ideas',
			description: 'Ability to communicate thoughts clearly'
		},
		{
			key: 'expressionOfAnger',
			label: 'Expression of Anger',
			description: 'How anger is expressed and managed'
		},
		{
			key: 'expressionOfSupport',
			label: 'Expression of Support',
			description: 'Ability to provide support to others'
		},
		{ key: 'selfCritical', label: 'Self-Critical', description: 'Tendency toward self-criticism' },
		{
			key: 'focusOverTime',
			label: 'Focus Over Time',
			description: 'Ability to maintain focus over extended periods'
		},
		{
			key: 'performanceUnderPressure',
			label: 'Performance Under Pressure',
			description: 'Ability to perform well in stressful situations'
		},
		{ key: 'confidence', label: 'Confidence', description: 'Overall confidence level' },
		{ key: 'energy', label: 'Energy', description: 'Energy level and vitality' },
		{ key: 'competitiveness', label: 'Competitiveness', description: 'General competitive drive' },
		{
			key: 'extraversion',
			label: 'Extraversion',
			description: 'Social and outgoing personality traits'
		},
		{ key: 'critical', label: 'Critical', description: 'Critical thinking and evaluation skills' },
		{ key: 'anxiety', label: 'Anxiety', description: 'Level of anxiety and worry' },
		{
			key: 'distractibility',
			label: 'Distractibility',
			description: 'Overall distractibility level'
		}
	];

	let form = {
		userId: '',
		assessmentDate: new Date().toISOString().split('T')[0],
		notes: '',
		scores: {} as Record<string, number>
	};

	let submitting = false;
	let submitted = false;
	let error = '';
	let activeTab = 'manual'; // 'manual' or 'csv' or 'existing'

	// Initialize scores object
	onMount(() => {
		taisDimensions.forEach((dimension) => {
			form.scores[dimension.key] = 50; // Default to middle percentile
		});
	});

	async function submitTAISData() {
		submitting = true;
		error = '';

		try {
			// Validate required fields
			if (!form.userId) {
				throw new Error('Please select a user');
			}

			// Validate all scores are between 0-99.9 (percentile scores)
			for (const [key, score] of Object.entries(form.scores)) {
				if (score < 0 || score > 99.9) {
					throw new Error(`Score for ${key} must be between 0 and 99.9`);
				}
			}

			const response = await fetch('/api/admin/tais-upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: parseInt(form.userId),
					scores: form.scores,
					assessmentDate: form.assessmentDate,
					notes: form.notes
				})
			});

			if (response.ok) {
				submitted = true;
				// Reset form
				form = {
					userId: '',
					assessmentDate: new Date().toISOString().split('T')[0],
					notes: '',
					scores: {} as Record<string, number>
				};
				taisDimensions.forEach((dimension) => {
					form.scores[dimension.key] = 50;
				});
				// Refresh existing results
				await loadExistingResults();
			} else {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload TAIS data');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			submitting = false;
		}
	}

	async function loadExistingResults() {
		try {
			const response = await fetch('/api/admin/tais-results');
			if (response.ok) {
				const data = await response.json();
				existingTaisResults = data.results;
			}
		} catch (err) {
			console.error('Failed to load existing results:', err);
		}
	}

	async function deleteTaisResult(resultId: number) {
		if (
			!confirm('Are you sure you want to delete this TAIS result? This action cannot be undone.')
		) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/tais-results/${resultId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Refresh existing results
				await loadExistingResults();
			} else {
				const result = await response.json();
				error = result.error || 'Failed to delete TAIS result';
			}
		} catch (err) {
			error = 'Failed to delete TAIS result';
			console.error('Delete error:', err);
		}
	}

	function resetForm() {
		submitted = false;
		error = '';
		form = {
			userId: '',
			assessmentDate: new Date().toISOString().split('T')[0],
			notes: '',
			scores: {} as Record<string, number>
		};
		taisDimensions.forEach((dimension) => {
			form.scores[dimension.key] = 50;
		});
	}

	function getUserEmail(userId: number) {
		const user = users.find((u) => u.id === userId);
		return user ? user.email : 'Unknown User';
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>TAIS Upload - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<div class="flex items-center">
					<button on:click={() => goto('/admin')} class="mr-4 text-blue-600 hover:text-blue-800">
						← Back to Admin
					</button>
					<h1 class="text-2xl font-bold text-gray-900">TAIS Assessment Upload</h1>
				</div>
				<div class="text-sm text-gray-500">
					Logged in as: {user?.email}
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if submitted}
			<!-- Success Message -->
			<div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
				<div class="flex items-center">
					<div class="mr-3 text-2xl text-green-400">✅</div>
					<div>
						<h3 class="text-lg font-medium text-green-800">TAIS Data Uploaded Successfully!</h3>
						<p class="text-green-700">
							The TAIS assessment data has been saved and is now available to the user.
						</p>
					</div>
				</div>
				<div class="mt-4">
					<button
						on:click={resetForm}
						class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Upload Another Assessment
					</button>
				</div>
			</div>
		{:else}
			<!-- Tab Navigation -->
			<div class="mb-6 border-b border-gray-200">
				<nav class="-mb-px flex space-x-8">
					<button
						on:click={() => (activeTab = 'manual')}
						class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'manual'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					>
						Manual Upload
					</button>
					<button
						on:click={() => (activeTab = 'csv')}
						class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'csv'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					>
						CSV Import
					</button>
					<button
						on:click={() => {
							activeTab = 'existing';
							loadExistingResults();
						}}
						class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'existing'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					>
						View Existing ({existingTaisResults?.length || 0})
					</button>
				</nav>
			</div>

			{#if activeTab === 'manual'}
				<!-- Manual Upload Form -->
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Upload TAIS Assessment Data</h2>

					{#if error}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
							<div class="flex items-center">
								<div class="mr-2 text-xl text-red-400">⚠️</div>
								<div class="text-red-800">{error}</div>
							</div>
						</div>
					{/if}

					<form on:submit|preventDefault={submitTAISData} class="space-y-6">
						<!-- User Selection -->
						<div>
							<label for="userId" class="mb-2 block text-sm font-medium text-gray-700">
								Select User *
							</label>
							<select
								id="userId"
								bind:value={form.userId}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
								required
							>
								<option value="">Choose a user...</option>
								{#each users as user}
									<option value={user.id}>{user.email}</option>
								{/each}
							</select>
						</div>

						<!-- Assessment Date -->
						<div>
							<label for="assessmentDate" class="mb-2 block text-sm font-medium text-gray-700">
								Assessment Date
							</label>
							<input
								type="date"
								id="assessmentDate"
								bind:value={form.assessmentDate}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
							/>
						</div>

						<!-- TAIS Dimensions -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900">
								TAIS Dimension Scores - Enter Percentile Values (0-99.9)
							</h3>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{#each taisDimensions as dimension}
									<div class="space-y-2">
										<label for={dimension.key} class="block text-sm font-medium text-gray-700">
											{dimension.label}
										</label>
										<p class="text-xs text-gray-500">{dimension.description}</p>
										<div class="flex items-center space-x-2">
											<input
												type="number"
												id={dimension.key}
												min="0"
												max="99.9"
												step="0.1"
												bind:value={form.scores[dimension.key]}
												class="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
												placeholder="50.0"
											/>
											<span class="text-xs text-gray-500">(0-99.9)</span>
										</div>
									</div>
								{/each}
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
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
								placeholder="Any additional notes about this assessment..."
							></textarea>
						</div>

						<!-- Submit Button -->
						<div class="flex justify-end space-x-4">
							<button
								type="button"
								on:click={() => goto('/admin')}
								class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting}
								class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{submitting ? 'Uploading...' : 'Upload TAIS Data'}
							</button>
						</div>
					</form>
				</div>
			{:else if activeTab === 'csv'}
				<!-- CSV Import -->
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">CSV Import</h2>
					<div class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<div class="flex items-center">
							<div class="mr-2 text-xl text-yellow-400">📋</div>
							<div>
								<h3 class="text-sm font-medium text-yellow-800">CSV Import Coming Soon</h3>
								<p class="text-sm text-yellow-700">
									This feature will allow bulk upload of TAIS data from CSV files.
								</p>
							</div>
						</div>
					</div>
					<p class="text-gray-600">For now, please use the manual upload form above.</p>
				</div>
			{:else if activeTab === 'existing'}
				<!-- Existing Results -->
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Existing TAIS Results</h2>

					{#if existingTaisResults && existingTaisResults.length > 0}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th
											class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
											>User</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
											>Assessment Date</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
											>Created</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
											>Notes</th
										>
										<th
											class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
											>Actions</th
										>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 bg-white">
									{#each existingTaisResults as result}
										<tr class="hover:bg-gray-50">
											<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
												{getUserEmail(result.userId)}
											</td>
											<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
												{result.assessmentDate
													? formatDate(result.assessmentDate.toString())
													: 'N/A'}
											</td>
											<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
												{result.createdAt ? formatDate(result.createdAt.toString()) : 'N/A'}
											</td>
											<td class="px-6 py-4 text-sm text-gray-500">
												{result.notes || 'No notes'}
											</td>
											<td class="px-6 py-4 text-sm text-gray-500">
												<button
													on:click={() => deleteTaisResult(result.id)}
													class="font-medium text-red-600 hover:text-red-800"
												>
													Delete
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<div class="py-12 text-center">
							<div class="text-gray-500">No TAIS results found</div>
							<p class="mt-2 text-sm text-gray-400">
								Upload the first TAIS assessment using the manual form.
							</p>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</main>
</div>
