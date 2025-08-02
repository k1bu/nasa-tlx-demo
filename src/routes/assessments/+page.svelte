<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
	let assessments = data.assessments;

	// Calculate completion counts
	$: taisCompleted = assessments.tais ? 1 : 0;
	$: driverIntakeCompleted = assessments.driverIntake ? 1 : 0;
	$: pressureCompleted = assessments.pressure ? 1 : 0;
	$: totalCompleted = taisCompleted + driverIntakeCompleted + pressureCompleted;
</script>

<svelte:head>
	<title>Assessments - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Assessments</h1>
			<p class="text-gray-600">Complete your mental performance assessments</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- TAIS Assessment -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-xl font-semibold text-gray-900">TAIS Inventory</h3>
					<span class="text-2xl">📊</span>
				</div>
				<p class="mb-4 text-gray-600">
					Test of Attentional and Interpersonal Style - Assess your attention and interpersonal
					style.
				</p>
				<div class="mb-4">
					<div class="flex items-center text-sm text-gray-500">
						<span class="mr-2 h-2 w-2 rounded-full {assessments.tais ? 'bg-green-500' : 'bg-gray-300'}"></span>
						<span>{assessments.tais ? 'Completed' : 'Not yet uploaded'}</span>
					</div>
				</div>
				{#if assessments.tais}
					<button
						on:click={() => goto('/assessments/tais/results')}
						class="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						View Results
					</button>
				{:else}
					<button disabled class="w-full cursor-not-allowed rounded bg-gray-400 px-4 py-2 text-white">
						Admin Upload Required
					</button>
				{/if}
			</div>

			<!-- Driver Intake -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-xl font-semibold text-gray-900">Driver Intake</h3>
					<span class="text-2xl">📋</span>
				</div>
				<p class="mb-4 text-gray-600">
					Driver Intake Questionnaire - Tell us about your racing experience and preferences.
				</p>
				<div class="mb-4">
					<div class="flex items-center text-sm text-gray-500">
						<span class="mr-2 h-2 w-2 rounded-full {assessments.driverIntake ? 'bg-green-500' : 'bg-gray-300'}"></span>
						<span>{assessments.driverIntake ? 'Completed' : 'Not Started'}</span>
					</div>
				</div>
				{#if assessments.driverIntake}
					<button
						on:click={() => goto('/assessments/driver-intake/results')}
						class="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						View Results
					</button>
				{:else}
					<button
						on:click={() => goto('/assessments/driver-intake')}
						class="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Start Assessment
					</button>
				{/if}
			</div>

			<!-- Pressure Assessment -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-xl font-semibold text-gray-900">Pressure Assessment</h3>
					<span class="text-2xl">🎯</span>
				</div>
				<p class="mb-4 text-gray-600">
					Pressure Questionnaire - Understand how you handle pressure and stress.
				</p>
				<div class="mb-4">
					<div class="flex items-center text-sm text-gray-500">
						<span class="mr-2 h-2 w-2 rounded-full {assessments.pressure ? 'bg-green-500' : 'bg-gray-300'}"></span>
						<span>{assessments.pressure ? 'Completed' : 'Not Started'}</span>
					</div>
				</div>
				{#if assessments.pressure}
					<button
						on:click={() => goto('/assessments/pressure/results')}
						class="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
					>
						View Results
					</button>
				{:else}
					<button
						on:click={() => goto('/assessments/pressure')}
						class="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
					>
						Start Assessment
					</button>
				{/if}
			</div>
		</div>

		<!-- Assessment Progress Summary -->
		<div class="mt-8 rounded-lg border border-gray-200 bg-white p-6">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Assessment Progress</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="text-center">
					<div class="text-2xl font-bold text-blue-600">{taisCompleted}/1</div>
					<div class="text-sm text-gray-600">TAIS Completed</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-green-600">{driverIntakeCompleted}/1</div>
					<div class="text-sm text-gray-600">Driver Intake Completed</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-purple-600">{pressureCompleted}/1</div>
					<div class="text-sm text-gray-600">Pressure Assessment Completed</div>
				</div>
			</div>
			<div class="mt-4 text-center">
				<div class="text-lg font-semibold text-gray-700">
					Total Progress: {totalCompleted}/3 Assessments
				</div>
			</div>
		</div>
	</main>
</div>
