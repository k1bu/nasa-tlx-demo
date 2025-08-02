<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let taisResult = data.taisResult;



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
</script>

<svelte:head>
	<title>TAIS Results - MindLap</title>
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
			<h1 class="text-3xl font-bold text-gray-900">TAIS Assessment Results</h1>
			<p class="text-gray-600">Your Test of Attentional and Interpersonal Style results</p>
		</div>

		{#if taisResult}
			<div class="space-y-6">
				<!-- Assessment Date -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Assessment Information</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm font-medium text-gray-500">Assessment Date</label>
							<p class="text-lg text-gray-900">{taisResult.assessmentDate}</p>
						</div>
					</div>
				</div>

				<!-- Dimension Scores -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Dimension Scores</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						{#each taisDimensions as dimension}
							{@const rawValue = taisResult[dimension.key as keyof typeof taisResult]}
							{@const score = parseFloat(rawValue as string) || 0}
							{@const percentage = (score / 99.9) * 100}
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<h3 class="font-medium text-gray-900">{dimension.label}</h3>
									<span class="text-lg font-semibold text-blue-600"
										>{score?.toFixed(1) || 'N/A'}</span
									>
								</div>
								<p class="text-sm text-gray-600">{dimension.description}</p>
								<div class="h-2 w-full rounded-full bg-gray-200">
									<div class="h-2 rounded-full bg-blue-600" style="width: {percentage}%"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- AI Insights Placeholder -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h2 class="mb-4 text-xl font-semibold text-gray-900">AI-Generated Insights</h2>
					<div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
						<div class="mb-4 text-4xl">🤖</div>
						<h3 class="mb-2 text-lg font-medium text-gray-900">AI Analysis Coming Soon</h3>
						<p class="text-gray-600">
							This section will feature AI-generated insights and personalized recommendations based
							on your TAIS assessment results.
						</p>
						<p class="mt-2 text-sm text-gray-500">
							The AI will analyze patterns across all 27 dimensions to provide actionable insights
							for your racing performance.
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<div class="mb-4 text-6xl">📊</div>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">No TAIS Results Available</h2>
				<p class="mb-6 text-gray-600">
					TAIS assessment results have not been uploaded yet. Please contact your administrator.
				</p>
				<button
					on:click={() => goto('/assessments')}
					class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
				>
					Back to Assessments
				</button>
			</div>
		{/if}
	</main>
</div>
