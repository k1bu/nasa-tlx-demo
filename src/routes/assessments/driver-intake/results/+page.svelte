<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let driverIntakeResult = data.driverIntakeResult;
</script>

<svelte:head>
	<title>Driver Intake Results - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<button
				on:click={() => goto('/assessments')}
				class="mb-4 flex items-center text-blue-600 hover:text-blue-800"
			>
				← Back to Assessments
			</button>
			<h1 class="text-3xl font-bold text-gray-900">Driver Intake Results</h1>
			<p class="text-gray-600">Your racing experience and preferences profile</p>
		</div>

		{#if driverIntakeResult}
			<div class="space-y-6">
				<!-- Assessment Information -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Assessment Information</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm font-medium text-gray-500">Assessment Date</label>
							<p class="text-lg text-gray-900">{driverIntakeResult.assessmentDate}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Version</label>
							<p class="text-lg text-gray-900">{driverIntakeResult.version}</p>
						</div>
					</div>
				</div>

				<!-- Racing Experience -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Racing Experience</h2>
					<div class="space-y-4">
						<div>
							<label class="text-sm font-medium text-gray-500">Racing Experience</label>
							<p class="text-gray-900">{driverIntakeResult.racingExperience}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Types of Driving</label>
							<p class="text-gray-900">{driverIntakeResult.drivingTypes}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">What You Enjoy Most</label>
							<p class="text-gray-900">{driverIntakeResult.enjoymentFactors}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Driving Style</label>
							<p class="text-gray-900">{driverIntakeResult.drivingStyle}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Best Performance</label>
							<p class="text-gray-900">{driverIntakeResult.bestPerformance}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Area for Improvement</label>
							<p class="text-gray-900">{driverIntakeResult.improvementArea}</p>
						</div>
					</div>
				</div>

				<!-- Mental Preparation -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Mental Preparation & Learning</h2>
					<div class="space-y-4">
						<div>
							<label class="text-sm font-medium text-gray-500">Mental Preparation Process</label>
							<p class="text-gray-900">{driverIntakeResult.mentalPreparation}</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Track Learning Process</label>
							<p class="text-gray-900">{driverIntakeResult.trackLearningProcess}</p>
						</div>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div>
								<label class="text-sm font-medium text-gray-500">Planning Style</label>
								<p class="text-gray-900 capitalize">{driverIntakeResult.planningStyle}</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Focus Level</label>
								<p class="text-gray-900">{driverIntakeResult.focusLevel}/10</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Learning Preference</label>
								<p class="text-gray-900 capitalize">{driverIntakeResult.learningPreference}</p>
							</div>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Feedback Processing</label>
							<p class="text-gray-900">{driverIntakeResult.feedbackProcessing}</p>
						</div>
					</div>
				</div>

				<!-- Post-Session Preferences -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Post-Session Preferences</h2>
					<div class="space-y-4">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label class="text-sm font-medium text-gray-500">Post-Session Preference</label>
								<p class="text-gray-900 capitalize">{driverIntakeResult.postSessionPreference}</p>
							</div>
							<div>
								<label class="text-sm font-medium text-gray-500">Technical Explanation Interest</label>
								<p class="text-gray-900">{driverIntakeResult.technicalExplanation}/10</p>
							</div>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500">Mental Performance Interest</label>
							<p class="text-gray-900">{driverIntakeResult.mentalSideInterest}</p>
						</div>
					</div>
				</div>

				<!-- Insights -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Profile Insights</h2>
					<div class="space-y-4">
						<div class="flex items-start space-x-3">
							<span class="text-green-500 text-xl">📋</span>
							<div>
								<h4 class="font-medium text-gray-900">Learning Style Identified</h4>
								<p class="text-gray-600">
									Your {driverIntakeResult.learningPreference} learning preference will help us tailor your mental performance training.
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<span class="text-blue-500 text-xl">🎯</span>
							<div>
								<h4 class="font-medium text-gray-900">Focus Level</h4>
								<p class="text-gray-600">
									Your focus level of {driverIntakeResult.focusLevel}/10 indicates {driverIntakeResult.focusLevel >= 7 ? 'strong' : driverIntakeResult.focusLevel >= 5 ? 'moderate' : 'room for improvement in'} concentration abilities.
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-3">
							<span class="text-purple-500 text-xl">⚙️</span>
							<div>
								<h4 class="font-medium text-gray-900">Technical Interest</h4>
								<p class="text-gray-600">
									Your technical explanation interest of {driverIntakeResult.technicalExplanation}/10 suggests {driverIntakeResult.technicalExplanation >= 7 ? 'high' : driverIntakeResult.technicalExplanation >= 5 ? 'moderate' : 'lower'} preference for detailed technical feedback.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<div class="mb-4 text-6xl">📋</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">No Driver Intake Results Available</h2>
				<p class="mb-6 text-gray-600">
					Driver Intake assessment has not been completed yet.
				</p>
				<button
					on:click={() => goto('/assessments/driver-intake')}
					class="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
				>
					Start Driver Intake
				</button>
			</div>
		{/if}
	</main>
</div> 