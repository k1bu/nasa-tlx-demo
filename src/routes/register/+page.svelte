<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let organization = '';
	let error = '';
	let loading = false;

	async function handleRegister() {
		loading = true;
		error = '';

		// Validate passwords match
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}

		// Validate password strength
		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			loading = false;
			return;
		}

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					organization: organization || undefined
				})
			});

			const data = await response.json();

			if (response.ok) {
				// Redirect to main page after successful registration
				goto('/');
			} else {
				error = data.error || 'Registration failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register - NASA TLX</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Or
			<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
				sign in to your existing account
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" on:submit|preventDefault={handleRegister}>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<div>
					<label for="organization" class="block text-sm font-medium text-gray-700">
						Organization (optional)
					</label>
					<div class="mt-1">
						<input
							id="organization"
							name="organization"
							type="text"
							bind:value={organization}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Your organization or team"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
					<div class="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							bind:value={password}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Enter your password"
						/>
					</div>
					<p class="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<div class="mt-1">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autocomplete="new-password"
							required
							bind:value={confirmPassword}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							placeholder="Confirm your password"
						/>
					</div>
				</div>

				{#if error}
					<div class="text-sm text-red-600">{error}</div>
				{/if}

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? 'Creating account...' : 'Create account'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
