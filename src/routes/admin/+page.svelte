<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	interface User {
		id: number;
		email: string;
		role: 'regular' | 'superuser' | 'coach';
		organization?: string;
		createdAt: string;
		lastLogin?: string;
		tlxCount: number;
		taisCount: number;
	}

	let users: User[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		await loadUsers();
	});

	async function loadUsers() {
		try {
			const response = await fetch('/api/admin/users');

			if (response.status === 401) {
				goto('/login');
				return;
			}

			if (response.status === 403) {
				goto('/');
				return;
			}

			if (response.ok) {
				const data = await response.json();
				users = data.users;
			} else {
				error = 'Failed to load users';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', { method: 'POST' });
			if (response.ok) {
				goto('/login');
			} else {
				console.error('Logout failed:', response.status);
			}
		} catch (err) {
			console.error('Logout error:', err);
		}
	}

	async function updateUserRole(userId: number, newRole: string) {
		try {
			const response = await fetch('/api/admin/users/update-role', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, newRole })
			});

			if (response.ok) {
				// Reload users to reflect changes
				await loadUsers();
			} else {
				const data = await response.json();
				console.error('Failed to update role:', data.error);
			}
		} catch (err) {
			console.error('Update role error:', err);
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function viewUserResults(userId: number) {
		goto(`/admin/users/${userId}`);
	}
</script>

<svelte:head>
	<title>Admin Dashboard - NASA TLX</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
					<p class="text-gray-600">Manage users and view TLX results</p>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/" class="text-indigo-600 hover:text-indigo-500">Back to TLX</a>
					<button
						on:click={handleLogout}
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		{#if loading}
			<div class="py-12 text-center">
				<div class="text-gray-500">Loading users...</div>
			</div>
		{:else if error}
			<div class="rounded-md border border-red-200 bg-red-50 p-4">
				<div class="text-red-700">{error}</div>
				<button
					on:click={loadUsers}
					class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
				>
					Try again
				</button>
			</div>
		{:else}
			<!-- Stats -->
			<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500">
									<svg
										class="h-5 w-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
										></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Total Users</dt>
									<dd class="text-lg font-medium text-gray-900">{users.length}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
									<svg
										class="h-5 w-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Total TLX Results</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.reduce((sum, user) => sum + user.tlxCount, 0)}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
									<svg
										class="h-5 w-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Total TAIS Results</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.reduce((sum, user) => sum + user.taisCount, 0)}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
									<svg
										class="h-5 w-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path>
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Active Users</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.filter((u) => u.lastLogin).length}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Admin Actions -->
			<div class="mb-8 overflow-hidden bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Admin Actions</h3>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">Manage assessments and user data</p>
				</div>
				<div class="border-t border-gray-200 px-4 py-5 sm:px-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
										<span class="text-lg text-white">📊</span>
									</div>
								</div>
								<div class="ml-4">
									<h4 class="text-sm font-medium text-blue-900">TAIS Assessment Upload</h4>
									<p class="text-sm text-blue-700">Upload TAIS assessment data for users</p>
									<button
										on:click={() => goto('/admin/tais-upload')}
										class="mt-2 rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
									>
										Upload TAIS Data
									</button>
								</div>
							</div>
						</div>
						<div class="rounded-lg border border-green-200 bg-green-50 p-4">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
										<span class="text-lg text-white">🏁</span>
									</div>
								</div>
								<div class="ml-4">
									<h4 class="text-sm font-medium text-green-900">Track Turns Management</h4>
									<p class="text-sm text-green-700">Manage turn-by-turn mental performance insights</p>
									<button
										on:click={() => goto('/admin/track-turns')}
										class="mt-2 rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
									>
										Manage Turns
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Users table -->
			<div class="overflow-hidden bg-white shadow sm:rounded-md">
				<div class="px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Users</h3>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">All users in your organization</p>
				</div>
				<div class="border-t border-gray-200">
					{#if users.length === 0}
						<div class="py-12 text-center">
							<div class="text-gray-500">No users found</div>
						</div>
					{:else}
						<ul class="divide-y divide-gray-200">
							{#each users as user}
								<li class="px-4 py-4 sm:px-6">
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<div class="h-10 w-10 flex-shrink-0">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300"
												>
													<span class="text-sm font-medium text-gray-700">
														{user.email.charAt(0).toUpperCase()}
													</span>
												</div>
											</div>
											<div class="ml-4">
												<div class="text-sm font-medium text-gray-900">{user.email}</div>
												<div class="text-sm text-gray-500">
													{user.organization || 'No organization'} • {user.role}
												</div>
											</div>
										</div>
										<div class="flex items-center space-x-4">
											<div class="text-sm text-gray-500">
												{user.tlxCount} TLX • {user.taisCount} TAIS
											</div>
											<div class="text-sm text-gray-500">
												Joined {formatDate(user.createdAt)}
											</div>
											{#if user.lastLogin}
												<div class="text-sm text-gray-500">
													Last login {formatDate(user.lastLogin)}
												</div>
											{/if}

											<!-- Role Management -->
											<select
												value={user.role}
												on:change={(e) =>
													updateUserRole(user.id, (e.target as HTMLSelectElement).value)}
												class="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
											>
												<option value="regular">Regular</option>
												<option value="superuser">Superuser</option>
												<option value="coach">Coach</option>
											</select>

											<!-- View Results Button -->
											{#if user.tlxCount > 0 || user.taisCount > 0}
												<button
													on:click={() => viewUserResults(user.id)}
													class="rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
												>
													View Results
												</button>
											{/if}
										</div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>
