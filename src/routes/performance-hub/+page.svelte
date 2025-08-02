<script lang="ts">
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	// Mock performance data for demonstration
	const mockPerformanceData = {
		recentLaps: [
			{ track: 'VIR', time: '1:45.234', date: '2024-01-15', improvement: '+0.8s' },
			{ track: 'VIR', time: '1:46.012', date: '2024-01-14', improvement: '+0.3s' },
			{ track: 'VIR', time: '1:46.345', date: '2024-01-13', improvement: 'baseline' }
		],
		bestTimes: {
			'VIR': '1:44.567',
			'Sebring': '2:12.890',
			'Road Atlanta': '1:28.234',
			'Watkins Glen': '1:52.123'
		},
		progress: {
			consistency: 85,
			improvement: '+2.3s',
			sessions: 12,
			totalLaps: 156
		}
	};

	// Driver performance features
	const driverFeatures = [
		{
			title: 'Lap Time Analytics',
			description: 'Comprehensive analysis of lap times, trends, and performance patterns',
			icon: '⏱️',
			features: [
				'Lap time trends and progression',
				'Sector analysis and optimization',
				'Personal best tracking',
				'Performance consistency metrics'
			]
		},
		{
			title: 'Cross-Track Comparison',
			description: 'Compare performance across different tracks and conditions',
			icon: '🏁',
			features: [
				'Track-to-track performance analysis',
				'Condition-based comparisons',
				'Seasonal performance trends',
				'Track mastery progression'
			]
		},
		{
			title: 'Training Progress',
			description: 'Track your development and training effectiveness over time',
			icon: '📈',
			features: [
				'Training session tracking',
				'Skill development metrics',
				'Goal setting and achievement',
				'Progress visualization'
			]
		},
		{
			title: 'Performance Predictions',
			description: 'AI-powered insights and performance forecasting',
			icon: '🔮',
			features: [
				'Performance prediction models',
				'Optimal session timing',
				'Improvement recommendations',
				'Risk assessment and mitigation'
			]
		}
	];

	// Car performance features
	const carFeatures = [
		{
			title: 'Vehicle Telemetry',
			description: 'Real-time car data and performance metrics',
			icon: '🚗',
			features: [
				'G-force analysis (lateral, longitudinal, vertical)',
				'Braking metrics and efficiency',
				'Acceleration curves and throttle data',
				'Engine performance monitoring'
			]
		},
		{
			title: 'Track Telemetry',
			description: 'GPS and positioning data for detailed track analysis',
			icon: '📍',
			features: [
				'GPS coordinates and speed data',
				'Track position and racing line analysis',
				'Corner entry/exit optimization',
				'Lap overlay comparisons'
			]
		},
		{
			title: 'Vehicle Dynamics',
			description: 'Advanced car dynamics and setup analysis',
			icon: '⚙️',
			features: [
				'Steering angle and suspension data',
				'Tire temperature and pressure monitoring',
				'Brake bias and temperature analysis',
				'Setup optimization recommendations'
			]
		},
		{
			title: 'Data Integration',
			description: 'Correlate car data with driver performance',
			icon: '🔗',
			features: [
				'Car + driver data correlation',
				'Performance impact analysis',
				'Setup influence on driver comfort',
				'Comprehensive performance insights'
			]
		}
	];

	// Integration features
	const integrationFeatures = [
		{
			title: 'TLX Integration',
			description: 'Mental workload correlation with performance',
			icon: '🧠',
			details: 'Correlate mental workload scores with lap times, corner performance, and decision-making under pressure'
		},
		{
			title: 'Biometrics Integration',
			description: 'Health data impact on performance',
			icon: '💓',
			details: 'Analyze how heart rate, stress levels, and recovery impact driving performance and consistency'
		},
		{
			title: 'Comprehensive Analytics',
			description: 'Holistic performance insights',
			icon: '📊',
			details: 'Combine all data sources for complete performance understanding and optimization'
		}
	];
</script>

<svelte:head>
	<title>Performance Hub - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Performance Hub</h1>
			<p class="text-gray-600">Comprehensive performance analytics and telemetry integration</p>
		</div>

		<!-- Performance Overview -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<div class="mb-4 flex items-center">
				<span class="mr-3 text-3xl">📈</span>
				<h2 class="text-xl font-semibold text-gray-900">Performance Overview</h2>
			</div>
			<p class="mb-6 text-gray-600">
				The Performance Hub will provide comprehensive analytics combining driver performance, vehicle telemetry, 
				and mental/health data for complete performance optimization.
			</p>
			
			<!-- Mock Performance Stats -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-blue-50 p-4">
					<div class="text-2xl font-bold text-blue-600">{mockPerformanceData.progress.sessions}</div>
					<div class="text-sm text-gray-600">Sessions</div>
				</div>
				<div class="rounded-lg bg-green-50 p-4">
					<div class="text-2xl font-bold text-green-600">{mockPerformanceData.progress.totalLaps}</div>
					<div class="text-sm text-gray-600">Total Laps</div>
				</div>
				<div class="rounded-lg bg-purple-50 p-4">
					<div class="text-2xl font-bold text-purple-600">{mockPerformanceData.progress.consistency}%</div>
					<div class="text-sm text-gray-600">Consistency</div>
				</div>
				<div class="rounded-lg bg-orange-50 p-4">
					<div class="text-2xl font-bold text-orange-600">{mockPerformanceData.progress.improvement}</div>
					<div class="text-sm text-gray-600">Improvement</div>
				</div>
			</div>
		</div>

		<!-- Driver Performance Section -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Driver Performance</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each driverFeatures as feature}
					<div class="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow">
						<div class="mb-4 flex items-center">
							<span class="mr-3 text-2xl">{feature.icon}</span>
							<h3 class="text-lg font-semibold text-gray-900">{feature.title}</h3>
						</div>
						<p class="mb-4 text-sm text-gray-600">{feature.description}</p>
						<ul class="space-y-1 text-sm text-gray-600">
							{#each feature.features as item}
								<li class="flex items-center">
									<span class="mr-2 text-blue-500">•</span>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Car Performance Section -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Car Performance & Telemetry</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each carFeatures as feature}
					<div class="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow">
						<div class="mb-4 flex items-center">
							<span class="mr-3 text-2xl">{feature.icon}</span>
							<h3 class="text-lg font-semibold text-gray-900">{feature.title}</h3>
						</div>
						<p class="mb-4 text-sm text-gray-600">{feature.description}</p>
						<ul class="space-y-1 text-sm text-gray-600">
							{#each feature.features as item}
								<li class="flex items-center">
									<span class="mr-2 text-green-500">•</span>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Data Integration Section -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Data Integration</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each integrationFeatures as feature}
					<div class="rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow">
						<div class="mb-4 flex items-center">
							<span class="mr-3 text-2xl">{feature.icon}</span>
							<h3 class="text-lg font-semibold text-gray-900">{feature.title}</h3>
						</div>
						<p class="mb-4 text-sm text-gray-600">{feature.description}</p>
						<p class="text-sm text-gray-500">{feature.details}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Sample Data Preview -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Sample Performance Data</h3>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left">
							<th class="pb-2 font-medium text-gray-900">Track</th>
							<th class="pb-2 font-medium text-gray-900">Best Time</th>
							<th class="pb-2 font-medium text-gray-900">Avg G-Force</th>
							<th class="pb-2 font-medium text-gray-900">Braking Efficiency</th>
							<th class="pb-2 font-medium text-gray-900">Mental Load</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b">
							<td class="py-2">VIR</td>
							<td class="py-2 font-mono">1:44.567</td>
							<td class="py-2">2.1g</td>
							<td class="py-2">92%</td>
							<td class="py-2">Medium</td>
						</tr>
						<tr class="border-b">
							<td class="py-2">Sebring</td>
							<td class="py-2 font-mono">2:12.890</td>
							<td class="py-2">1.8g</td>
							<td class="py-2">88%</td>
							<td class="py-2">High</td>
						</tr>
						<tr>
							<td class="py-2">Road Atlanta</td>
							<td class="py-2 font-mono">1:28.234</td>
							<td class="py-2">2.3g</td>
							<td class="py-2">95%</td>
							<td class="py-2">Medium</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Coming Soon Notice -->
		<div class="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
			<div class="text-center">
				<span class="mb-4 block text-4xl">🚀</span>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Coming Soon</h3>
				<p class="mb-4 text-gray-600">
					The Performance Hub is currently under development. We're building comprehensive analytics 
					that will integrate driver performance, vehicle telemetry, and mental/health data for 
					complete performance optimization.
				</p>
				<div class="flex justify-center space-x-4 text-sm text-gray-500">
					<span>📊 Analytics</span>
					<span>🚗 Telemetry</span>
					<span>🧠 TLX Integration</span>
					<span>💓 Biometrics</span>
				</div>
			</div>
		</div>
	</main>
</div> 