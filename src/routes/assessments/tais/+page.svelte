<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	// TAIS Assessment questions and scales
	const taisQuestions = [
		{
			id: 'internal_attention',
			label: 'Internal Attention',
			description: 'Ability to focus on internal thoughts and feelings',
			questions: [
				'I can easily focus on my internal thoughts and feelings',
				'I am aware of my emotional state during tasks',
				'I can concentrate on my breathing and body sensations',
				'I notice when my mind wanders and can bring it back'
			]
		},
		{
			id: 'external_attention',
			label: 'External Attention',
			description: 'Ability to focus on external stimuli and environment',
			questions: [
				'I can easily focus on external details and surroundings',
				'I notice small changes in my environment',
				'I can maintain focus on external tasks for long periods',
				'I am good at picking up on visual cues and signals'
			]
		},
		{
			id: 'broad_attention',
			label: 'Broad Attention',
			description: 'Ability to process multiple sources of information simultaneously',
			questions: [
				'I can handle multiple tasks or sources of information at once',
				'I can see the big picture while attending to details',
				'I can switch between different tasks efficiently',
				'I can integrate information from multiple sources'
			]
		},
		{
			id: 'focused_attention',
			label: 'Focused Attention',
			description: 'Ability to concentrate on a single task or stimulus',
			questions: [
				'I can maintain intense focus on a single task',
				'I can block out distractions when needed',
				'I can sustain attention for extended periods',
				'I can concentrate deeply on complex problems'
			]
		},
		{
			id: 'reduced_attention',
			label: 'Reduced Attention',
			description: 'Tendency to experience lapses in attention or concentration',
			questions: [
				'I sometimes lose track of what I was doing',
				'I can be easily distracted by irrelevant thoughts',
				'I sometimes miss important details due to inattention',
				'I can become mentally fatigued during long tasks'
			]
		},
		{
			id: 'information_processing',
			label: 'Information Processing',
			description: 'Speed and efficiency of processing information',
			questions: [
				'I can quickly process and understand new information',
				'I can make decisions rapidly when needed',
				'I can handle information overload effectively',
				'I can process complex information efficiently'
			]
		},
		{
			id: 'expression_of_ideas',
			label: 'Expression of Ideas',
			description: 'Ability to communicate thoughts and ideas clearly',
			questions: [
				'I can express my thoughts and ideas clearly',
				'I can communicate complex concepts effectively',
				'I can articulate my feelings and experiences well',
				'I can present information in an organized manner'
			]
		},
		{
			id: 'control',
			label: 'Control',
			description: 'Ability to regulate emotions and behavior',
			questions: [
				'I can control my emotional responses in stressful situations',
				'I can regulate my behavior and impulses',
				'I can maintain composure under pressure',
				'I can manage my stress levels effectively'
			]
		},
		{
			id: 'performance_under_pressure',
			label: 'Performance Under Pressure',
			description: 'Ability to perform well in high-pressure situations',
			questions: [
				'I perform well under pressure and stress',
				'I can maintain focus during high-stakes situations',
				'I can deliver my best performance when it matters most',
				'I can handle competitive pressure effectively'
			]
		},
		{
			id: 'frustration',
			label: 'Frustration',
			description: 'Tendency to experience frustration and negative emotions',
			questions: [
				"I can become frustrated when things don't go as planned",
				'I can get irritated by minor setbacks or delays',
				'I can experience negative emotions during difficult tasks',
				'I can become impatient when progress is slow'
			]
		},
		{
			id: 'fatigue',
			label: 'Fatigue',
			description: 'Tendency to experience mental and physical fatigue',
			questions: [
				'I can become mentally tired during long sessions',
				'I can experience physical fatigue during demanding tasks',
				'I can feel drained after intense concentration',
				'I can become less effective when tired'
			]
		},
		{
			id: 'self_confidence',
			label: 'Self-Confidence',
			description: "Level of confidence in one's abilities and performance",
			questions: [
				'I am confident in my abilities and skills',
				'I believe I can handle challenging situations',
				'I trust my decision-making abilities',
				'I am confident in my performance capabilities'
			]
		}
	];

	let form: Record<string, number[]> = {};
	let currentSection = 0;
	let submitting = false;
	let submitted = false;

	// Initialize form with empty arrays for each scale
	taisQuestions.forEach((scale) => {
		form[scale.id] = new Array(scale.questions.length).fill(5); // Default to middle value (5)
	});

	function nextSection() {
		if (currentSection < taisQuestions.length - 1) {
			currentSection++;
		}
	}

	function prevSection() {
		if (currentSection > 0) {
			currentSection--;
		}
	}

	async function submitAssessment() {
		submitting = true;

		try {
			// Calculate average scores for each scale
			const scores: Record<string, number> = {};
			taisQuestions.forEach((scale) => {
				const average =
					form[scale.id].reduce((sum, score) => sum + score, 0) / form[scale.id].length;
				scores[scale.id] = Math.round(average * 10) / 10; // Round to 1 decimal place
			});

			const response = await fetch('/api/assessments/tais', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					scores,
					rawResponses: form,
					assessmentDate: new Date().toISOString().split('T')[0]
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

	function getProgressPercentage() {
		return ((currentSection + 1) / taisQuestions.length) * 100;
	}
</script>

<svelte:head>
	<title>TAIS Assessment - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !submitted}
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900">TAIS Assessment</h1>
				<p class="text-gray-600">Test of Attentional and Interpersonal Style</p>
			</div>

			<!-- Progress Bar -->
			<div class="mb-8">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700">
						Section {currentSection + 1} of {taisQuestions.length}
					</span>
					<span class="text-sm text-gray-500">{Math.round(getProgressPercentage())}% Complete</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-blue-600 transition-all duration-300"
						style="width: {getProgressPercentage()}%"
					></div>
				</div>
			</div>

			<!-- Current Section -->
			<div class="mb-6 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-2 text-xl font-semibold text-gray-900">
					{taisQuestions[currentSection].label}
				</h2>
				<p class="mb-6 text-gray-600">{taisQuestions[currentSection].description}</p>

				<div class="space-y-6">
					{#each taisQuestions[currentSection].questions as question, index}
						<div class="rounded-lg border border-gray-200 p-4">
							<label class="mb-3 block text-sm font-medium text-gray-700">
								{index + 1}. {question}
							</label>
							<div class="flex items-center justify-between">
								<span class="text-xs text-gray-500">Strongly Disagree</span>
								<div class="flex space-x-4">
									{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as value}
										<label class="flex items-center">
											<input
												type="radio"
												name="scale_{taisQuestions[currentSection].id}_{index}"
												{value}
												bind:group={form[taisQuestions[currentSection].id][index]}
												class="sr-only"
											/>
											<div
												class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-medium transition-colors {form[
													taisQuestions[currentSection].id
												][index] === value
													? 'border-blue-600 bg-blue-600 text-white'
													: 'border-gray-300 hover:border-blue-400'}"
											>
												{value}
											</div>
										</label>
									{/each}
								</div>
								<span class="text-xs text-gray-500">Strongly Agree</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Navigation Buttons -->
			<div class="flex justify-between">
				<button
					on:click={prevSection}
					disabled={currentSection === 0}
					class="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Previous
				</button>

				{#if currentSection < taisQuestions.length - 1}
					<button
						on:click={nextSection}
						class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
					>
						Next
					</button>
				{:else}
					<button
						on:click={submitAssessment}
						disabled={submitting}
						class="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
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
					Thank you for completing the TAIS assessment. Your results have been saved and will be
					available in your driver profile.
				</p>
				<div class="space-x-4">
					<button
						on:click={() => goto('/dashboard')}
						class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
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
