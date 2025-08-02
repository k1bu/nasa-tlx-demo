<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface TLXResult {
		id: number;
		task: string;
		mental: number;
		physical: number;
		temporal: number;
		performance: number;
		effort: number;
		frustration: number;
		mentalWeight: number;
		physicalWeight: number;
		temporalWeight: number;
		performanceWeight: number;
		effortWeight: number;
		frustrationWeight: number;
		createdAt: string;
	}

	interface TAISResult {
		id: number;
		awareness: number;
		externalDistractibility: number;
		analyticalConceptual: number;
		internalDistractibility: number;
		actionFocused: number;
		reducedFlexibility: number;
		informationProcessing: number;
		orientationToRulesAndRisks: number;
		control: number;
		selfConfidence: number;
		physicallyCompetitive: number;
		decisionMakingStyle: number;
		extroversion: number;
		introversion: number;
		expressionOfIdeas: number;
		expressionOfAnger: number;
		expressionOfSupport: number;
		selfCritical: number;
		focusOverTime: number;
		performanceUnderPressure: number;
		confidence: number;
		energy: number;
		competitiveness: number;
		extraversion: number;
		critical: number;
		anxiety: number;
		distractibility: number;
		assessmentDate: string;
		createdAt: string;
		notes: string;
	}

	interface User {
		id: number;
		email: string;
		role: string;
		organization: string;
		createdAt: string;
	}

	let user: User | null = null;
	let tlxResults: TLXResult[] = [];
	let taisResults: TAISResult[] = [];
	let loading = true;
	let error = '';
	let activeTab = 'tlx';

	$: userId = $page.params.userId;

	onMount(async () => {
		await loadUserData();
	});

	async function loadUserData() {
		try {
			loading = true;
			error = '';

			// Load user info
			const userResponse = await fetch(`/api/admin/users/${userId}`);
			if (userResponse.ok) {
				const userData = await userResponse.json();
				user = userData.user;
			}

			// Load TLX results
			const tlxResponse = await fetch(`/api/admin/users/${userId}/tlx`);
			if (tlxResponse.ok) {
				const tlxData = await tlxResponse.json();
				tlxResults = tlxData.results;
			}

			// Load TAIS results
			const taisResponse = await fetch(`/api/admin/users/${userId}/tais`);
			if (taisResponse.ok) {
				const taisData = await taisResponse.json();
				taisResults = taisData.results;
			}
		} catch (err) {
			error = 'Failed to load user data';
			console.error('Load user data error:', err);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function calculateTLXScore(result: TLXResult) {
		const scores = [
			result.mental * result.mentalWeight,
			result.physical * result.physicalWeight,
			result.temporal * result.temporalWeight,
			result.performance * result.performanceWeight,
			result.effort * result.effortWeight,
			result.frustration * result.frustrationWeight
		];
		return scores.reduce((sum, score) => sum + score, 0) / 15; // Divide by 15 (sum of weights)
	}

	// TAIS dimension labels in the correct order
	const taisDimensions = [
		{ key: 'awareness', label: 'Awareness' },
		{ key: 'externalDistractibility', label: 'External Distractibility' },
		{ key: 'analyticalConceptual', label: 'Analytical/Conceptual' },
		{ key: 'internalDistractibility', label: 'Internal Distractibility' },
		{ key: 'actionFocused', label: 'Action/Focused' },
		{ key: 'reducedFlexibility', label: 'Reduced Flexibility' },
		{ key: 'informationProcessing', label: 'Information Processing' },
		{ key: 'orientationToRulesAndRisks', label: 'Orientation to Rules and Risks' },
		{ key: 'control', label: 'Control' },
		{ key: 'selfConfidence', label: 'Self-Confidence' },
		{ key: 'physicallyCompetitive', label: 'Physically Competitive' },
		{ key: 'decisionMakingStyle', label: 'Decision Making Style' },
		{ key: 'extroversion', label: 'Extroversion' },
		{ key: 'introversion', label: 'Introversion' },
		{ key: 'expressionOfIdeas', label: 'Expression of Ideas' },
		{ key: 'expressionOfAnger', label: 'Expression of Anger' },
		{ key: 'expressionOfSupport', label: 'Expression of Support' },
		{ key: 'selfCritical', label: 'Self-Critical' },
		{ key: 'focusOverTime', label: 'Focus Over Time' },
		{ key: 'performanceUnderPressure', label: 'Performance Under Pressure' },
		{ key: 'confidence', label: 'Confidence' },
		{ key: 'energy', label: 'Energy' },
		{ key: 'competitiveness', label: 'Competitiveness' },
		{ key: 'extraversion', label: 'Extraversion' },
		{ key: 'critical', label: 'Critical' },
		{ key: 'anxiety', label: 'Anxiety' },
		{ key: 'distractibility', label: 'Distractibility' }
	];
</script>

<svelte:head>
	<title>User Results - Admin</title>
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
					<div>
						<h1 class="text-2xl font-bold text-gray-900">User Results</h1>
						{#if user}
							<p class="text-gray-600">{user.email}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if loading}
			<div class="py-12 text-center">
				<div class="text-gray-500">Loading user data...</div>
			</div>
		{:else if error}
			<div class="rounded-md border border-red-200 bg-red-50 p-4">
				<div class="text-red-700">{error}</div>
				<button
					on:click={loadUserData}
					class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
				>
					Try again
				</button>
			</div>
		{:else if user}
			<!-- User Info -->
			<div class="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">User Information</h3>
				</div>
				<div class="border-t border-gray-200 px-4 py-5 sm:px-6">
					<dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
						<div>
							<dt class="text-sm font-medium text-gray-500">Email</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.email}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Role</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.role}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Organization</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.organization || 'None'}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Joined</dt>
							<dd class="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</dd>
						</div>
					</dl>
				</div>
			</div>

			<!-- Assessment Results -->
			<div class="mb-8">
				<!-- Tab Navigation -->
				<div class="border-b border-gray-200">
					<nav class="-mb-px flex space-x-8">
						<button
							on:click={() => (activeTab = 'tlx')}
							class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'tlx'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
						>
							TLX Results ({tlxResults.length})
						</button>
						<button
							on:click={() => (activeTab = 'tais')}
							class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'tais'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
						>
							TAIS Results ({taisResults.length})
						</button>
					</nav>
				</div>

				<!-- Tab Content -->
				<div class="mt-6">
					{#if activeTab === 'tlx'}
						<!-- TLX Results -->
						<div class="overflow-hidden bg-white shadow sm:rounded-lg">
							{#if tlxResults.length === 0}
								<div class="px-4 py-12 text-center sm:px-6">
									<div class="text-gray-500">No TLX results found</div>
								</div>
							{:else}
								<div class="overflow-x-auto">
									<table class="min-w-full divide-y divide-gray-200">
										<thead class="bg-gray-50">
											<tr>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Task
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													TLX Score
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Mental
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Physical
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Temporal
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Performance
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Effort
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Frustration
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
												>
													Date
												</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-gray-200 bg-white">
											{#each tlxResults as result}
												<tr class="hover:bg-gray-50">
													<td class="px-6 py-4 text-sm font-medium text-gray-900">
														{result.task || 'N/A'}
													</td>
													<td class="px-6 py-4 text-sm text-gray-900">
														{calculateTLXScore(result).toFixed(1)}
													</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.mental}</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.physical}</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.temporal}</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.performance}</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.effort}</td>
													<td class="px-6 py-4 text-sm text-gray-500">{result.frustration}</td>
													<td class="px-6 py-4 text-sm text-gray-500">
														{formatDate(result.createdAt)}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>
					{:else if activeTab === 'tais'}
						<!-- TAIS Results -->
						<div class="overflow-hidden bg-white shadow sm:rounded-lg">
							{#if taisResults.length === 0}
								<div class="px-4 py-12 text-center sm:px-6">
									<div class="text-gray-500">No TAIS results found</div>
								</div>
							{:else}
								{#each taisResults as result}
									<div class="border-b border-gray-200 px-4 py-6 sm:px-6">
										<div class="mb-4">
											<h4 class="text-lg font-medium text-gray-900">
												TAIS Assessment - {formatDate(result.assessmentDate || result.createdAt)}
											</h4>
											{#if result.notes}
												<p class="mt-1 text-sm text-gray-500">{result.notes}</p>
											{/if}
										</div>

										<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
											{#each taisDimensions as dimension}
												<div class="rounded-lg border border-gray-200 p-3">
													<div class="text-sm font-medium text-gray-900">
														{dimension.label}
													</div>
													<div class="text-lg font-semibold text-blue-600">
														{(
															parseFloat(result[dimension.key as keyof TAISResult] as string) || 0
														).toFixed(1)}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>
