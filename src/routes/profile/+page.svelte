<script lang="ts">
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import DriverNav from '$lib/components/DriverNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;
</script>

<svelte:head>
	<title>Profile - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	{#if user?.role === 'driver'}
		<DriverNav {user} />
	{:else}
		<DashboardNav {user} />
	{/if}

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Profile</h1>
			<p class="text-gray-600">Your account information and settings</p>
		</div>

		{#if user?.role === 'driver'}
			<!-- Driver Profile - Simplified -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="mb-6">
					<h2 class="text-xl font-semibold text-gray-900">Account Information</h2>
					<p class="text-gray-600">Your basic account details</p>
				</div>

				<div class="space-y-4">
					<div class="flex items-center justify-between border-b border-gray-200 pb-4">
						<span class="font-medium text-gray-700">Email:</span>
						<span class="text-gray-900">{user.email}</span>
					</div>
					<div class="flex items-center justify-between border-b border-gray-200 pb-4">
						<span class="font-medium text-gray-700">Role:</span>
						<span
							class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
						>
							Driver
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="font-medium text-gray-700">Account Type:</span>
						<span class="text-gray-900">TLX Assessment User</span>
					</div>
				</div>
			</div>
		{:else}
			<!-- Full Profile - For regular users and admins -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="mb-6">
					<h2 class="text-xl font-semibold text-gray-900">Account Information</h2>
					<p class="text-gray-600">Your account details and preferences</p>
				</div>

				<div class="space-y-4">
					<div class="flex items-center justify-between border-b border-gray-200 pb-4">
						<span class="font-medium text-gray-700">Email:</span>
						<span class="text-gray-900">{user.email}</span>
					</div>
					<div class="flex items-center justify-between border-b border-gray-200 pb-4">
						<span class="font-medium text-gray-700">Role:</span>
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
						>
							{user.role}
						</span>
					</div>
					{#if user.organization}
						<div class="flex items-center justify-between border-b border-gray-200 pb-4">
							<span class="font-medium text-gray-700">Organization:</span>
							<span class="text-gray-900">{user.organization}</span>
						</div>
					{/if}
					<div class="flex items-center justify-between">
						<span class="font-medium text-gray-700">Account Type:</span>
						<span class="text-gray-900">Full Platform User</span>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
