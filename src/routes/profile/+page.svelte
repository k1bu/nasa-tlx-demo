<script lang="ts">
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
</script>

<svelte:head>
	<title>Driver Profile - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Driver Profile</h1>
			<p class="text-gray-600">View your assessment results and insights</p>
		</div>

		<div class="text-center py-12">
			<span class="text-6xl mb-4 block">👤</span>
			<h2 class="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
			<p class="text-gray-600">Driver profile features are under development</p>
		</div>
	</main>
</div> 