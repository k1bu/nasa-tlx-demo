<script lang="ts">
	import { goto } from '$app/navigation';

	export let user: { email?: string; role?: string } | null = null;

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
</script>

<nav class="border-b bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-4">
			<!-- Logo and Brand -->
			<div class="flex items-center">
				<button
					on:click={() => goto('/dashboard')}
					class="flex items-center space-x-2 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600"
				>
					<span>🏎️</span>
					<span>MindLap</span>
				</button>
			</div>

			<!-- Navigation Links - Driver Only -->
			<div class="hidden items-center space-x-8 md:flex">
				<button
					on:click={() => goto('/tlx')}
					class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<span>📊</span>
					<span>TLX Assessment</span>
				</button>
				<button
					on:click={() => goto('/profile')}
					class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<span>👤</span>
					<span>Profile</span>
				</button>
			</div>

			<!-- User Menu -->
			<div class="flex items-center space-x-4">
				<span class="hidden text-sm text-gray-600 sm:block">
					{user?.email}
				</span>
				<button
					on:click={handleLogout}
					class="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
				>
					Logout
				</button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		<div class="md:hidden">
			<div class="flex space-x-4 overflow-x-auto py-2">
				<button
					on:click={() => goto('/tlx')}
					class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<span>📊</span>
					<span>TLX Assessment</span>
				</button>
				<button
					on:click={() => goto('/profile')}
					class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<span>👤</span>
					<span>Profile</span>
				</button>
			</div>
		</div>
	</div>
</nav>
