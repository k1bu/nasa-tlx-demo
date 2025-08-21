<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let message = '';
	let error = '';
	let loading = false;

	async function handleForgotPassword() {
		loading = true;
		error = '';
		message = '';

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (response.ok) {
				message = data.message;
				// In development, show the debug info
				if (data.debug) {
					console.log('Debug info:', data.debug);
					message += ` (Check console for reset link)`;
				}
			} else {
				error = data.error || 'Failed to send reset email';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password - NASA TLX</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Enter your email address and we'll send you a link to reset your password.
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" on:submit|preventDefault={handleForgotPassword}>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
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

				{#if message}
					<div class="rounded-md bg-green-50 p-3 text-sm text-green-600">{message}</div>
				{/if}

				{#if error}
					<div class="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
				{/if}

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? 'Sending...' : 'Send reset link'}
					</button>
				</div>

				<div class="text-center">
					<a href="/login" class="text-sm text-indigo-600 hover:text-indigo-500"> Back to login </a>
				</div>
			</form>
		</div>
	</div>
</div>


