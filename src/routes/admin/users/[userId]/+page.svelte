<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface TLXResult {
		id: number;
		task: string;
		goal?: string | null;
		track?: string | null;
		seriesCompetition?: string | null;
		trackConditions?: string | null;
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

	interface DriverIntakeResult {
		id: number;
		racingExperience: string;
		drivingTypes: string;
		enjoymentFactors: string;
		drivingStyle: string;
		bestPerformance: string;
		improvementArea: string;
		mentalPreparation: string;
		trackLearningProcess: string;
		planningStyle: string;
		focusLevel: number;
		learningPreference: string;
		feedbackProcessing: string;
		postSessionPreference: string;
		technicalExplanation: number;
		mentalSideInterest: string;
		version: string;
		completed: boolean;
		createdAt: string;
	}

	interface PressureResult {
		id: number;
		pressureFeelings: string;
		pressureEffect: string;
		pressurePerformanceRating: number;
		stressfulSituations: string;
		mistakeRecoveryTime: string;
		resetStrategies: string;
		raceDayPreparation: string;
		postSessionDrain: number;
		version: string;
		completed: boolean;
		createdAt: string;
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
	let driverIntakeResults: DriverIntakeResult[] = [];
	let pressureResults: PressureResult[] = [];
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

			// Load Driver Intake results
			const driverIntakeResponse = await fetch(`/api/admin/users/${userId}/driver-intake`);
			if (driverIntakeResponse.ok) {
				const driverIntakeData = await driverIntakeResponse.json();
				driverIntakeResults = driverIntakeData.results;
			}

			// Load Pressure Assessment results
			const pressureResponse = await fetch(`/api/admin/users/${userId}/pressure`);
			if (pressureResponse.ok) {
				const pressureData = await pressureResponse.json();
				pressureResults = pressureData.results;
			}
		} catch (err) {
			error = 'Failed to load user data';
			console.error('Load user data error:', err);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// TLX dimension icons and colors
	const tlxDimensions = [
		{ key: 'mental', label: 'Mental', icon: '🧠', color: 'text-blue-600' },
		{ key: 'physical', label: 'Physical', icon: '💪', color: 'text-green-600' },
		{ key: 'temporal', label: 'Temporal', icon: '⏱️', color: 'text-yellow-600' },
		{ key: 'performance', label: 'Performance', icon: '🎯', color: 'text-purple-600' },
		{ key: 'effort', label: 'Effort', icon: '⚡', color: 'text-orange-600' },
		{ key: 'frustration', label: 'Frustration', icon: '😤', color: 'text-red-600' }
	];

	function getTLXIcon(key: string): string {
		return tlxDimensions.find((d) => d.key === key)?.icon || '📊';
	}

	function getTLXColor(key: string): string {
		return tlxDimensions.find((d) => d.key === key)?.color || 'text-gray-600';
	}

	function getScoreColor(score: number): string {
		if (score >= 70) return 'text-red-600 font-semibold';
		if (score >= 50) return 'text-yellow-600 font-medium';
		return 'text-green-600';
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
						<button
							on:click={() => (activeTab = 'driver-intake')}
							class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'driver-intake'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
						>
							Driver Intake ({driverIntakeResults.length})
						</button>
						<button
							on:click={() => (activeTab = 'pressure')}
							class="border-b-2 px-1 py-2 text-sm font-medium {activeTab === 'pressure'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
						>
							Pressure Assessment ({pressureResults.length})
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
								<div class="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto relative">
									<table class="min-w-full divide-y divide-gray-200">
										<thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
											<tr>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Date
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Task
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Goal
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Track
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Series/Competition
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													Track Conditions
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													TLX Score
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('mental')}</span>
														<span>Mental</span>
													</span>
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('physical')}</span>
														<span>Physical</span>
													</span>
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('temporal')}</span>
														<span>Temporal</span>
													</span>
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('performance')}</span>
														<span>Performance</span>
													</span>
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('effort')}</span>
														<span>Effort</span>
													</span>
												</th>
												<th
													class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase bg-gray-50"
												>
													<span class="flex items-center gap-1">
														<span>{getTLXIcon('frustration')}</span>
														<span>Frustration</span>
													</span>
												</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-gray-200 bg-white">
											{#each tlxResults as result}
												<tr class="hover:bg-gray-50 transition-colors">
													<td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
														{formatDate(result.createdAt)}
													</td>
													<td class="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
														<div class="truncate" title={result.task || 'N/A'}>
															{result.task || 'N/A'}
														</div>
													</td>
													<td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
														<div class="truncate" title={result.goal || '—'}>
															{result.goal || '—'}
														</div>
													</td>
													<td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
														<div class="truncate" title={result.track || '—'}>
															{result.track || '—'}
														</div>
													</td>
													<td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
														<div class="truncate" title={result.seriesCompetition || '—'}>
															{result.seriesCompetition || '—'}
														</div>
													</td>
													<td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
														{#if result.trackConditions}
															<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
																{result.trackConditions}
															</span>
														{:else}
															<span class="text-gray-400">—</span>
														{/if}
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="{getScoreColor(calculateTLXScore(result))}">
															{calculateTLXScore(result).toFixed(1)}
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('mental')}">
															<span>{getTLXIcon('mental')}</span>
															<span>{result.mental}</span>
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('physical')}">
															<span>{getTLXIcon('physical')}</span>
															<span>{result.physical}</span>
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('temporal')}">
															<span>{getTLXIcon('temporal')}</span>
															<span>{result.temporal}</span>
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('performance')}">
															<span>{getTLXIcon('performance')}</span>
															<span>{result.performance}</span>
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('effort')}">
															<span>{getTLXIcon('effort')}</span>
															<span>{result.effort}</span>
														</span>
													</td>
													<td class="px-6 py-4 text-sm whitespace-nowrap">
														<span class="flex items-center gap-1 {getTLXColor('frustration')}">
															<span>{getTLXIcon('frustration')}</span>
															<span>{result.frustration}</span>
														</span>
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
					{:else if activeTab === 'driver-intake'}
						<!-- Driver Intake Results -->
						<div class="overflow-hidden bg-white shadow sm:rounded-lg">
							{#if driverIntakeResults.length === 0}
								<div class="px-4 py-12 text-center sm:px-6">
									<div class="text-gray-500">No Driver Intake results found</div>
								</div>
							{:else}
								{#each driverIntakeResults as result}
									<div class="border-b border-gray-200 px-4 py-6 sm:px-6">
										<div class="mb-4">
											<h4 class="text-lg font-medium text-gray-900">
												Driver Intake Questionnaire - {formatDate(result.createdAt)}
											</h4>
											<div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
												<span>Version: {result.version}</span>
												<span class="flex items-center">
													<span class="mr-1">Completed:</span>
													<span
														class="font-medium {result.completed
															? 'text-green-600'
															: 'text-red-600'}"
													>
														{result.completed ? 'Yes' : 'No'}
													</span>
												</span>
											</div>
										</div>

										<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
											<!-- Section 1: Driving Background & Style -->
											<div class="space-y-4">
												<h5 class="text-md font-semibold text-gray-800">
													Driving Background & Style
												</h5>
												<div class="space-y-3">
													<div>
														<dt class="text-sm font-medium text-gray-500">Racing Experience</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.racingExperience || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Driving Types</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.drivingTypes || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Enjoyment Factors</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.enjoymentFactors || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Driving Style (3 words)
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.drivingStyle || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Best Performance</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.bestPerformance || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Improvement Area</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.improvementArea || 'Not provided'}
														</dd>
													</div>
												</div>
											</div>

											<!-- Section 2: Thinking, Focus & Learning Style -->
											<div class="space-y-4">
												<h5 class="text-md font-semibold text-gray-800">
													Thinking, Focus & Learning Style
												</h5>
												<div class="space-y-3">
													<div>
														<dt class="text-sm font-medium text-gray-500">Mental Preparation</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.mentalPreparation || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Track Learning Process
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.trackLearningProcess || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Planning Style</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.planningStyle || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Focus Level (1-5)</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.focusLevel || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Learning Preference</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.learningPreference || 'Not provided'}
														</dd>
													</div>
												</div>
											</div>

											<!-- Section 3: Feedback & Reflection -->
											<div class="space-y-4">
												<h5 class="text-md font-semibold text-gray-800">Feedback & Reflection</h5>
												<div class="space-y-3">
													<div>
														<dt class="text-sm font-medium text-gray-500">Feedback Processing</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.feedbackProcessing || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Post-Session Preference
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.postSessionPreference || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Technical Explanation (1-5)
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.technicalExplanation || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Mental Side Interest</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.mentalSideInterest || 'Not provided'}
														</dd>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							{/if}
						</div>
					{:else if activeTab === 'pressure'}
						<!-- Pressure Assessment Results -->
						<div class="overflow-hidden bg-white shadow sm:rounded-lg">
							{#if pressureResults.length === 0}
								<div class="px-4 py-12 text-center sm:px-6">
									<div class="text-gray-500">No Pressure Assessment results found</div>
								</div>
							{:else}
								{#each pressureResults as result}
									<div class="border-b border-gray-200 px-4 py-6 sm:px-6">
										<div class="mb-4">
											<h4 class="text-lg font-medium text-gray-900">
												Pressure Assessment - {formatDate(result.createdAt)}
											</h4>
											<div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
												<span>Version: {result.version}</span>
												<span class="flex items-center">
													<span class="mr-1">Completed:</span>
													<span
														class="font-medium {result.completed
															? 'text-green-600'
															: 'text-red-600'}"
													>
														{result.completed ? 'Yes' : 'No'}
													</span>
												</span>
											</div>
										</div>

										<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
											<!-- Section 1: Pressure Perception -->
											<div class="space-y-4">
												<h5 class="text-md font-semibold text-gray-800">Pressure Perception</h5>
												<div class="space-y-3">
													<div>
														<dt class="text-sm font-medium text-gray-500">Pressure Feelings</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.pressureFeelings || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Pressure Effect</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.pressureEffect || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Performance Under Pressure (1-5)
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.pressurePerformanceRating || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Stressful Situations</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.stressfulSituations || 'Not provided'}
														</dd>
													</div>
												</div>
											</div>

											<!-- Section 2: Recovery & Coping -->
											<div class="space-y-4">
												<h5 class="text-md font-semibold text-gray-800">Recovery & Coping</h5>
												<div class="space-y-3">
													<div>
														<dt class="text-sm font-medium text-gray-500">Mistake Recovery Time</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.mistakeRecoveryTime || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Reset Strategies</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.resetStrategies || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">Race Day Preparation</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.raceDayPreparation || 'Not provided'}
														</dd>
													</div>
													<div>
														<dt class="text-sm font-medium text-gray-500">
															Post-Session Drain (1-5)
														</dt>
														<dd class="mt-1 text-sm text-gray-900">
															{result.postSessionDrain || 'Not provided'}
														</dd>
													</div>
												</div>
											</div>
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
