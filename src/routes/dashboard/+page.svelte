<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import DriverDashboard from '$lib/components/DriverDashboard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let user = data.user;
	let dashboardStats = {
		totalAssessments: 0,
		recentTlxCount: 0,
		completedCourses: 0,
		trackSessions: 0
	};

	// Dashboard cards configuration
	const dashboardCards = [
		{
			id: 'tlx',
			title: 'Take TLX Assessment',
			description: 'Quick mental workload assessment',
			icon: '📊',
			color: 'bg-blue-500',
			hoverColor: 'hover:bg-blue-600',
			action: () => goto('/tlx'),
			priority: 'high'
		},
		{
			id: 'assessments',
			title: 'Assessments',
			description: 'TAIS, Driver Intake, Pressure questionnaires',
			icon: '📋',
			color: 'bg-green-500',
			hoverColor: 'hover:bg-green-600',
			action: () => goto('/assessments'),
			priority: 'medium'
		},
		{
			id: 'tracks',
			title: 'Tracks & Performance',
			description: 'Track data, lap times, turn analysis',
			icon: '🏁',
			color: 'bg-purple-500',
			hoverColor: 'hover:bg-purple-600',
			action: () => goto('/tracks'),
			priority: 'medium'
		},
		{
			id: 'courses',
			title: 'Mental Performance Courses',
			description: 'Learn mental skills and techniques',
			icon: '🧠',
			color: 'bg-orange-500',
			hoverColor: 'hover:bg-orange-600',
			action: () => goto('/courses'),
			priority: 'medium'
		},
		{
			id: 'profile',
			title: 'Driver Profile',
			description: 'View your assessment results and insights',
			icon: '👤',
			color: 'bg-indigo-500',
			hoverColor: 'hover:bg-indigo-600',
			action: () => goto('/profile'),
			priority: 'low'
		},
		{
			id: 'performance',
			title: 'Performance Data',
			description: 'Lap times, biometrics, and analytics',
			icon: '📈',
			color: 'bg-red-500',
			hoverColor: 'hover:bg-red-600',
			action: () => goto('/performance'),
			priority: 'low'
		}
	];

	// Quick actions for frequent tasks
	const quickActions = [
		{
			title: 'New TLX Assessment',
			description: 'Start a mental workload assessment',
			icon: '⚡',
			action: () => goto('/tlx')
		},
		{
			title: 'Add Lap Time',
			description: 'Record your latest session',
			icon: '⏱️',
			action: () => goto('/performance/add-lap')
		},
		{
			title: 'View Recent Results',
			description: 'Check your latest assessments',
			icon: '📊',
			action: () => goto('/profile')
		}
	];

	onMount(async () => {
		await fetchDashboardStats();
	});

	async function fetchDashboardStats() {
		try {
			const response = await fetch('/api/dashboard/stats');
			if (response.ok) {
				const data = await response.json();
				dashboardStats = data.stats;
			}
		} catch (error) {
			console.error('Error fetching dashboard stats:', error);
		}
	}
</script>

<svelte:head>
	<title>MindLap Dashboard</title>
</svelte:head>

{#if user?.role === 'driver'}
	<!-- Driver Dashboard - Simplified -->
	<DriverDashboard {user} />
{:else}
	<!-- Full Dashboard - For regular users and admins -->
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation -->
		<DashboardNav {user} />

		<!-- Main Content -->
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Welcome Section -->
			<div class="mb-8">
				<h2 class="mb-2 text-2xl font-semibold text-gray-900">
					Welcome back, {user?.email?.split('@')[0]}!
				</h2>
				<p class="text-gray-600">
					Ready to optimize your mental performance? Here's what you can do today.
				</p>
			</div>

			<!-- Quick Actions -->
			<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each quickActions as action}
					<button
						on:click={action.action}
						class="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
							{action.icon}
						</div>
						<div class="flex-1">
							<h3 class="font-medium text-gray-900">{action.title}</h3>
							<p class="text-sm text-gray-600">{action.description}</p>
						</div>
					</button>
				{/each}
			</div>

			<!-- Dashboard Cards -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each dashboardCards as card}
					<div
						class="group cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg"
						on:click={card.action}
					>
						<div class="p-6">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex h-12 w-12 items-center justify-center rounded-lg {card.color} text-2xl text-white">
									{card.icon}
								</div>
								{#if card.priority === 'high'}
									<span class="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
										High Priority
									</span>
								{/if}
							</div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">{card.title}</h3>
							<p class="text-gray-600">{card.description}</p>
						</div>
						<div class="bg-gray-50 px-6 py-3 transition-colors group-hover:bg-gray-100">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-gray-700">Get Started</span>
								<svg
									class="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</main>
	</div>
{/if}

<style>
	/* Custom styles for smooth transitions */
	.group:hover .group-hover\:bg-blue-100 {
		background-color: #dbeafe;
	}

	.group:hover .group-hover\:text-blue-600 {
		color: #2563eb;
	}
</style>
