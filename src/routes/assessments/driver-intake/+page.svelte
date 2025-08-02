<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	let form = {
		// Racing Experience
		racingExperience: '',
		drivingTypes: '',
		enjoymentFactors: '',
		drivingStyle: '',
		bestPerformance: '',
		improvementArea: '',

		// Mental Preparation
		mentalPreparation: '',
		trackLearningProcess: '',
		planningStyle: 'structured', // structured, flexible, adaptive
		focusLevel: 5, // 1-10 scale
		learningPreference: 'visual', // visual, auditory, kinesthetic
		feedbackProcessing: '',

		// Post-Session
		postSessionPreference: 'immediate', // immediate, delayed, mixed
		technicalExplanation: 5, // 1-10 scale
		mentalSideInterest: '',

		// Additional Info
		version: 'v2',
		completed: false
	};

	let currentStep = 1;
	let totalSteps = 4;
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

	function getProgressPercentage() {
		if (totalSteps === 1) return 100;
		return ((currentStep - 1) / totalSteps) * 100;
	}

	async function submitAssessment() {
		submitting = true;

		try {
			const response = await fetch('/api/assessments/driver-intake', {
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
	<title>Driver Intake Questionnaire - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !submitted}
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Driver Intake Questionnaire</h1>
				<p class="text-gray-600">Tell us about your racing experience and preferences</p>
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
						class="h-2 rounded-full bg-green-600 transition-all duration-300"
						style="width: {progressPercentage}%"
					></div>
				</div>
			</div>

			<!-- Step 1: Racing Experience -->
			{#if currentStep === 1}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Racing Experience</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								Describe your racing experience and background
							</label>
							<textarea
								bind:value={form.racingExperience}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Tell us about your racing history, experience level, and background..."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What types of driving/racing do you participate in?
							</label>
							<textarea
								bind:value={form.drivingTypes}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="e.g., road racing, autocross, karting, sim racing, etc."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What do you enjoy most about driving/racing?
							</label>
							<textarea
								bind:value={form.enjoymentFactors}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="What aspects of driving bring you the most satisfaction?"
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How would you describe your driving style?
							</label>
							<textarea
								bind:value={form.drivingStyle}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Are you aggressive, smooth, technical, etc.?"
							></textarea>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 2: Performance -->
			{#if currentStep === 2}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Performance & Improvement</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								Describe your best performance or most satisfying driving experience
							</label>
							<textarea
								bind:value={form.bestPerformance}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="What made this experience special? How did you feel?"
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What area would you like to improve most?
							</label>
							<textarea
								bind:value={form.improvementArea}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Mental preparation, consistency, speed, technique, etc."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How do you typically prepare mentally before a session or race?
							</label>
							<textarea
								bind:value={form.mentalPreparation}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Routines, visualization, breathing, etc."
							></textarea>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 3: Learning & Focus -->
			{#if currentStep === 3}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Learning & Focus</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How do you typically learn a new track?
							</label>
							<textarea
								bind:value={form.trackLearningProcess}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Walk the track, sim practice, video review, etc."
							></textarea>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What's your preferred planning style?
							</label>
							<select
								bind:value={form.planningStyle}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
							>
								<option value="structured">Structured - I like detailed plans and routines</option>
								<option value="flexible">Flexible - I adapt based on conditions and feel</option>
								<option value="adaptive"
									>Adaptive - I combine planning with on-the-fly adjustments</option
								>
							</select>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How would you rate your ability to maintain focus during sessions? (1-10)
							</label>
							<div class="flex items-center space-x-4">
								<span class="text-sm text-gray-500">Poor Focus</span>
								<input
									type="range"
									min="1"
									max="10"
									bind:value={form.focusLevel}
									class="flex-1 accent-green-600"
								/>
								<span class="text-sm text-gray-500">Excellent Focus</span>
								<span class="w-8 text-center font-medium">{form.focusLevel}</span>
							</div>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How do you prefer to receive feedback and instruction?
							</label>
							<textarea
								bind:value={form.feedbackProcessing}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Immediate feedback, detailed explanations, visual examples, etc."
							></textarea>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 4: Preferences -->
			{#if currentStep === 4}
				<div class="mb-6 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Preferences & Interests</h2>

					<div class="space-y-6">
						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								When do you prefer to review session data and feedback?
							</label>
							<select
								bind:value={form.postSessionPreference}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
							>
								<option value="immediate">Immediately after the session</option>
								<option value="delayed">Later, after some time to reflect</option>
								<option value="mixed">Mix of both approaches</option>
							</select>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								How much do you value technical explanations? (1-10)
							</label>
							<div class="flex items-center space-x-4">
								<span class="text-sm text-gray-500">Not Important</span>
								<input
									type="range"
									min="1"
									max="10"
									bind:value={form.technicalExplanation}
									class="flex-1 accent-green-600"
								/>
								<span class="text-sm text-gray-500">Very Important</span>
								<span class="w-8 text-center font-medium">{form.technicalExplanation}</span>
							</div>
						</div>

						<div>
							<label class="mb-2 block text-sm font-medium text-gray-700">
								What aspects of the mental side of racing interest you most?
							</label>
							<textarea
								bind:value={form.mentalSideInterest}
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
								placeholder="Focus techniques, pressure management, visualization, etc."
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
						class="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
					>
						Next
					</button>
				{:else}
					<button
						on:click={submitAssessment}
						disabled={submitting}
						class="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
					>
						{submitting ? 'Submitting...' : 'Submit Questionnaire'}
					</button>
				{/if}
			</div>
		{:else}
			<!-- Success Message -->
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<div class="mb-4 text-6xl">✅</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">Questionnaire Submitted!</h2>
				<p class="mb-6 text-gray-600">
					Thank you for completing the Driver Intake Questionnaire. Your responses will help us
					personalize your mental performance training.
				</p>
				<div class="space-x-4">
					<button
						on:click={() => goto('/dashboard')}
						class="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
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
