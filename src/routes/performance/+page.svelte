<script lang="ts">
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	// Wearable integrations data
	const wearableIntegrations = [
		{
			id: 'apple-watch',
			name: 'Apple Watch',
			description: 'Heart rate, HRV, activity levels, and stress monitoring',
			icon: '⌚',
			status: 'planned',
			features: [
				'Heart Rate Variability',
				'Stress Detection',
				'Activity Rings',
				'Workout Detection'
			],
			integration: 'HealthKit API',
			difficulty: 'Easy'
		},
		{
			id: 'fitbit',
			name: 'Fitbit',
			description: 'Comprehensive health tracking and sleep analysis',
			icon: '📱',
			status: 'planned',
			features: ['Sleep Stages', 'Resting Heart Rate', 'Stress Score', 'Recovery Metrics'],
			integration: 'Fitbit Web API',
			difficulty: 'Easy'
		},
		{
			id: 'oura-ring',
			name: 'Oura Ring',
			description: 'Advanced sleep tracking and recovery insights',
			icon: '💍',
			status: 'planned',
			features: ['Sleep Quality', 'Recovery Score', 'Body Temperature', 'Respiratory Rate'],
			integration: 'Oura Cloud API',
			difficulty: 'Medium'
		},
		{
			id: 'emotiv',
			name: 'EMOTIV',
			description: 'Brain-computer interface for cognitive performance',
			icon: '🧠',
			status: 'planned',
			features: ['Brain Activity', 'Focus Levels', 'Mental Fatigue', 'Cognitive Load'],
			integration: 'EMOTIV API',
			difficulty: 'Advanced'
		},
		{
			id: 'garmin',
			name: 'Garmin',
			description: 'Sports-focused metrics and training load',
			icon: '🏃',
			status: 'planned',
			features: ['Training Load', 'Recovery Time', 'Body Battery', 'Stress Tracking'],
			integration: 'Garmin Connect API',
			difficulty: 'Medium'
		},
		{
			id: 'polar',
			name: 'Polar',
			description: 'Professional heart rate monitoring and training',
			icon: '❤️',
			status: 'planned',
			features: ['Heart Rate Zones', 'Training Load Pro', 'Recovery Pro', 'Sleep Plus'],
			integration: 'Polar Accesslink API',
			difficulty: 'Medium'
		},
		{
			id: 'whoop',
			name: 'WHOOP',
			description: 'Recovery-focused performance optimization',
			icon: '🔄',
			status: 'planned',
			features: ['Recovery Score', 'Strain Score', 'Sleep Performance', 'Cardiovascular Load'],
			integration: 'WHOOP API',
			difficulty: 'Medium'
		},
		{
			id: 'biostrap',
			name: 'Biostrap',
			description: 'Advanced biometrics and sleep analysis',
			icon: '📊',
			status: 'planned',
			features: ['Sleep Architecture', 'HRV Analysis', 'Recovery Metrics', 'Performance Score'],
			integration: 'Biostrap API',
			difficulty: 'Advanced'
		}
	];

	// Mock biometric data for demonstration
	const mockBiometricData = {
		heartRate: { current: 72, resting: 58, max: 185 },
		hrv: { current: 45, average: 42, trend: 'improving' },
		stress: { current: 25, level: 'low', trend: 'stable' },
		sleep: { lastNight: 7.5, quality: 85, deep: 2.1, rem: 1.8 },
		recovery: { score: 78, readiness: 'good', recommendation: 'moderate training' }
	};

	function getStatusColor(status: string) {
		switch (status) {
			case 'planned':
				return 'bg-blue-100 text-blue-800';
			case 'in-development':
				return 'bg-yellow-100 text-yellow-800';
			case 'available':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getDifficultyColor(difficulty: string) {
		switch (difficulty) {
			case 'Easy':
				return 'bg-green-100 text-green-800';
			case 'Medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'Advanced':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Biometrics Hub - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Biometrics Hub</h1>
			<p class="text-gray-600">Wearable device integration and health data analytics</p>
		</div>

		<!-- Overview Section -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<div class="mb-4 flex items-center">
				<span class="mr-3 text-3xl">💓</span>
				<h2 class="text-xl font-semibold text-gray-900">Biometric Overview</h2>
			</div>
			<p class="mb-4 text-gray-600">
				The Biometrics Hub will integrate with your wearable devices to provide comprehensive health
				insights that correlate with your mental performance and racing data.
			</p>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				<div class="rounded-lg bg-blue-50 p-4">
					<div class="text-2xl font-bold text-blue-600">{mockBiometricData.heartRate.current}</div>
					<div class="text-sm text-gray-600">Current HR</div>
				</div>
				<div class="rounded-lg bg-green-50 p-4">
					<div class="text-2xl font-bold text-green-600">{mockBiometricData.hrv.current}ms</div>
					<div class="text-sm text-gray-600">HRV</div>
				</div>
				<div class="rounded-lg bg-purple-50 p-4">
					<div class="text-2xl font-bold text-purple-600">{mockBiometricData.stress.current}%</div>
					<div class="text-sm text-gray-600">Stress Level</div>
				</div>
				<div class="rounded-lg bg-orange-50 p-4">
					<div class="text-2xl font-bold text-orange-600">{mockBiometricData.sleep.lastNight}h</div>
					<div class="text-sm text-gray-600">Sleep</div>
				</div>
				<div class="rounded-lg bg-indigo-50 p-4">
					<div class="text-2xl font-bold text-indigo-600">{mockBiometricData.recovery.score}%</div>
					<div class="text-sm text-gray-600">Recovery</div>
				</div>
			</div>
		</div>

		<!-- Wearable Integrations -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Wearable Integrations</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each wearableIntegrations as integration}
					<div class="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow">
						<div class="mb-4 flex items-center">
							<span class="mr-3 text-3xl">{integration.icon}</span>
							<div>
								<h3 class="text-lg font-semibold text-gray-900">{integration.name}</h3>
								<span
									class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusColor(
										integration.status
									)}"
								>
									{integration.status}
								</span>
							</div>
						</div>

						<p class="mb-4 text-sm text-gray-600">{integration.description}</p>

						<div class="mb-4">
							<h4 class="mb-2 text-sm font-medium text-gray-900">Key Features:</h4>
							<ul class="space-y-1 text-sm text-gray-600">
								{#each integration.features as feature}
									<li class="flex items-center">
										<span class="mr-2 text-green-500">✓</span>
										{feature}
									</li>
								{/each}
							</ul>
						</div>

						<div class="flex items-center justify-between text-sm">
							<div>
								<span class="text-gray-500">Integration:</span>
								<span class="ml-1 font-medium text-gray-900">{integration.integration}</span>
							</div>
							<span
								class="inline-flex items-center rounded px-2 py-1 text-xs font-medium {getDifficultyColor(
									integration.difficulty
								)}"
							>
								{integration.difficulty}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Planned Features -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Data Correlation -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="mb-4 flex items-center">
					<span class="mr-3 text-2xl">🔗</span>
					<h3 class="text-lg font-semibold text-gray-900">Data Correlation</h3>
				</div>
				<p class="mb-4 text-gray-600">
					Correlate biometric data with your TLX assessments, lap times, and mental performance to
					identify patterns.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<span class="mr-2 text-blue-500">•</span>
						Stress levels vs. TLX performance scores
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-blue-500">•</span>
						Sleep quality impact on lap times
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-blue-500">•</span>
						HRV trends and mental fatigue correlation
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-blue-500">•</span>
						Recovery scores and decision-making performance
					</li>
				</ul>
			</div>

			<!-- AI Insights -->
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="mb-4 flex items-center">
					<span class="mr-3 text-2xl">🤖</span>
					<h3 class="text-lg font-semibold text-gray-900">AI Performance Insights</h3>
				</div>
				<p class="mb-4 text-gray-600">
					AI-powered analysis of your biometric patterns to provide personalized performance
					recommendations.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<span class="mr-2 text-purple-500">•</span>
						Optimal training timing based on recovery
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-purple-500">•</span>
						Mental preparation strategies
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-purple-500">•</span>
						Stress management techniques
					</li>
					<li class="flex items-center">
						<span class="mr-2 text-purple-500">•</span>
						Performance prediction models
					</li>
				</ul>
			</div>
		</div>

		<!-- Coming Soon Notice -->
		<div
			class="mt-8 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6"
		>
			<div class="text-center">
				<span class="mb-4 block text-4xl">🚀</span>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Coming Soon</h3>
				<p class="mb-4 text-gray-600">
					The Biometrics Hub is currently under development. We're working on integrating with the
					most popular wearable devices to provide you with comprehensive health insights.
				</p>
				<div class="flex justify-center space-x-4 text-sm text-gray-500">
					<span>📱 Apple Watch</span>
					<span>💍 Oura Ring</span>
					<span>🧠 EMOTIV</span>
					<span>📊 Advanced Analytics</span>
				</div>
			</div>
		</div>
	</main>
</div>
