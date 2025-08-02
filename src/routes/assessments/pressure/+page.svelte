<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	let form = {
		// Pressure Perception
		pressureFeelings: '',
		pressureEffect: '',
		pressureRating: 3, // 1-5 scale
		stressfulSituations: [],

		// Recovery & Coping
		mistakeRecovery: '',
		resetStrategies: '',
		mentalPreparation: '',
		drainLevel: 3, // 1-5 scale

		// General Pressure
		audienceEffect: '',
		composureTechniques: '',

		// Additional Info
		version: 'v2',
		completed: false
	};

	let currentStep = 1;
	let totalSteps = 3;
	let submitting = false;
	let submitted = false;

	// Reactive statement to ensure progress updates when currentStep changes
	$: progressPercentage = totalSteps === 1 ? 100 : ((currentStep - 1) / totalSteps) * 100;
	$: console.log(`Reactive: Step ${currentStep}, progress: ${progressPercentage}%`);

	function nextStep() {
		if (currentStep < totalSteps) {
			currentStep = currentStep + 1;
			console.log('Next clicked, currentStep is now:', currentStep);
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep = currentStep - 1;
			console.log('Previous clicked, currentStep is now:', currentStep);
		}
	}

	async function submitAssessment() {
		submitting = true;

		try {
			const response = await fetch('/api/assessments/pressure', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...form,
					completed: true
				})
			});

			if (response.ok) {
				submitted = true;
			} else {
				alert('Failed to submit assessment. Please try again.');
			}
		} catch (error) {
			console.error('Error submitting assessment:', error);
			alert('Error submitting assessment. Please try again.');
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Pressure Assessment - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !submitted}
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Pressure Assessment</h1>
				<p class="text-gray-600">Understand how you handle pressure and stress</p>
			</div>

			<!-- Progress Bar -->
			<div class="mb-8">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700">
						Step {currentStep} of {totalSteps}
					</span>
					<span class="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-purple-600 transition-all duration-300"
						style="width: {progressPercentage}%"
					></div>
				</div>
			</div>

			<!-- Step 1: Pressure Perception -->
			{#if currentStep === 1}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Pressure Perception</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								When you're under pressure on track (e.g., pushing a lap, someone behind you, time constraints), how do you feel it physically or mentally?
							</label>
							<textarea
								bind:value={form.pressureFeelings}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Describe how pressure manifests for you..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								Does pressure usually improve or hurt your driving? Why?
							</label>
							<textarea
								bind:value={form.pressureEffect}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Explain how pressure affects your performance..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								Rate how much pressure affects your performance:
							</label>
							<div class="flex items-center space-x-4">
								<span class="text-sm text-gray-500">Hurts focus and decision-making</span>
								<input
									type="range"
									min="1"
									max="5"
									bind:value={form.pressureRating}
									class="flex-1 accent-purple-600"
								/>
								<span class="text-sm text-gray-500">Brings out my best</span>
								<span class="w-8 text-center font-medium">{form.pressureRating}</span>
							</div>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What types of situations feel most stressful to you during a session?
							</label>
							<div class="space-y-2">
								{#each ['Chasing lap time', 'Defending position', 'Making mistakes', 'Driving in the rain', 'Being watched', 'Session debrief / review', 'Restarting after a mistake'] as situation}
									<label class="flex items-center">
										<input
											type="checkbox"
											value={situation}
											bind:group={form.stressfulSituations}
											class="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
										/>
										<span class="text-sm text-gray-700">{situation}</span>
									</label>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 2: Recovery & Coping -->
			{#if currentStep === 2}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Recovery & Coping</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								When you make a mistake (e.g., lock-up, missed apex), how long does it affect your driving?
							</label>
							<textarea
								bind:value={form.mistakeRecovery}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Describe your recovery process..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What do you typically do to reset after something goes wrong?
							</label>
							<textarea
								bind:value={form.resetStrategies}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="e.g., breathing, self-talk, driving harder, slowing down briefly..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How do you prepare yourself mentally on the day of a race or driving event?
							</label>
							<textarea
								bind:value={form.mentalPreparation}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Describe your mental preparation routine..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								After a high-pressure session, how mentally or physically drained do you feel?
							</label>
							<div class="flex items-center space-x-4">
								<span class="text-sm text-gray-500">Not at all drained</span>
								<input
									type="range"
									min="1"
									max="5"
									bind:value={form.drainLevel}
									class="flex-1 accent-purple-600"
								/>
								<span class="text-sm text-gray-500">Completely drained</span>
								<span class="w-8 text-center font-medium">{form.drainLevel}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 3: General Pressure -->
			{#if currentStep === 3}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">General Pressure</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								When others are watching (team principal, family, sponsors), how does your mindset change?
							</label>
							<textarea
								bind:value={form.audienceEffect}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Describe how being watched affects your performance..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What helps you stay composed under pressure — routines, breathing, music, visualization, etc.?
							</label>
							<textarea
								bind:value={form.composureTechniques}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
								placeholder="Share your techniques for staying composed..."
							></textarea>
						</div>
					</div>
				</div>
			{/if}

			<!-- Navigation Buttons -->
			<div class="flex justify-between">
				<button
					on:click={prevStep}
					disabled={currentStep === 1}
					class="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Previous
				</button>

				{#if currentStep < totalSteps}
					<button
						on:click={nextStep}
						class="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
					>
						Next
					</button>
				{:else}
					<button
						on:click={submitAssessment}
						disabled={submitting}
						class="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
					>
						{submitting ? 'Submitting...' : 'Submit Assessment'}
					</button>
				{/if}
			</div>
		{:else}
			<!-- Success Message -->
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<div class="mb-4 text-6xl">✅</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">Assessment Submitted!</h2>
				<p class="mb-6 text-gray-600">
					Thank you for completing the Pressure Assessment. Your responses will help us understand how you handle pressure and stress.
				</p>
				<div class="space-x-4">
					<button
						on:click={() => goto('/dashboard')}
						class="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
					>
						Back to Dashboard
					</button>
					<button
						on:click={() => goto('/profile')}
						class="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
					>
						View Profile
					</button>
				</div>
			</div>
		{/if}
	</main>
</div> 