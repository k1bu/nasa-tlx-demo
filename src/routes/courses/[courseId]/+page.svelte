<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	// Course data mapping - in a real app, this would come from the database
	const allCourses = {
		1: {
			id: 1,
			title: "The Driver's Mind: Foundations of Mental Performance",
			description:
				'Core concepts of attention, cognitive load, and how psychology influences driving. Introduces TAIS and mental profiling.',
			duration: '45 min',
			icon: '🧠',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner',
			learningObjectives: [
				'Understand how attention works in high-performance driving',
				'Learn about cognitive load and its impact on performance',
				'Discover how psychology influences driving decisions',
				'Get introduced to TAIS mental profiling concepts'
			],
			courseModules: [
				{
					id: 1,
					title: 'Introduction to Mental Performance',
					duration: '15 min',
					description: 'Overview of mental performance in motorsport and why it matters.',
					completed: false
				},
				{
					id: 2,
					title: 'Attention and Focus Fundamentals',
					duration: '20 min',
					description: 'Understanding different types of attention and how to manage them.',
					completed: false
				},
				{
					id: 3,
					title: 'TAIS Introduction',
					duration: '10 min',
					description: 'Introduction to the Test of Attentional and Interpersonal Style.',
					completed: false
				}
			]
		},
		2: {
			id: 2,
			title: 'Flow & Focus: Building Deep Concentration Behind the Wheel',
			description:
				'Techniques for sustained attention, entering flow states, and tuning out distractions. Managing Broad vs Focused attention.',
			duration: '60 min',
			icon: '🎯',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner',
			learningObjectives: [
				'Master techniques for entering and maintaining flow states',
				'Learn to manage different types of attention',
				'Develop strategies for tuning out distractions',
				'Build sustained concentration skills'
			],
			courseModules: [
				{
					id: 1,
					title: 'Understanding Flow States',
					duration: '20 min',
					description: 'What flow is and how it applies to driving.',
					completed: false
				},
				{
					id: 2,
					title: 'Attention Management',
					duration: '25 min',
					description: 'Broad vs focused attention techniques.',
					completed: false
				},
				{
					id: 3,
					title: 'Distraction Management',
					duration: '15 min',
					description: 'Strategies for maintaining focus under pressure.',
					completed: false
				}
			]
		}
	};

	const courseId = parseInt(data.courseId);
	const courseData = allCourses[courseId as keyof typeof allCourses];

	// If course not found, redirect to courses page
	if (!courseData) {
		goto('/courses');
	}
</script>

<svelte:head>
	<title>{courseData.title} - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	{#if courseData}
		<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Back Button -->
			<button on:click={() => goto('/courses')} class="mb-6 text-blue-600 hover:text-blue-800">
				← Back to Courses
			</button>

			<!-- Course Header -->
			<div class="mb-8 rounded-lg bg-white p-8 shadow">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="mb-4 flex items-center space-x-3">
							<span class="text-4xl">{courseData.icon}</span>
							<div>
								<span
									class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
								>
									{courseData.difficulty}
								</span>
							</div>
						</div>
						<h1 class="mb-4 text-3xl font-bold text-gray-900">{courseData.title}</h1>
						<p class="mb-6 text-lg text-gray-600">{courseData.description}</p>

						<div class="flex items-center space-x-6 text-sm text-gray-500">
							<span class="flex items-center">⏱️ {courseData.duration}</span>
							<span class="flex items-center">📚 {courseData.courseModules.length} modules</span>
							<span class="flex items-center">🎯 {courseData.difficulty} level</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Learning Objectives -->
			<div class="mb-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">What You'll Learn</h2>
				<ul class="space-y-3">
					{#each courseData.learningObjectives as objective}
						<li class="flex items-start">
							<span class="mt-1 mr-3 text-green-500">✓</span>
							<span class="text-gray-700">{objective}</span>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Course Modules -->
			<div class="mb-8 rounded-lg bg-white p-6 shadow">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Course Modules</h2>
				<div class="space-y-4">
					{#each courseData.courseModules as module, index}
						<div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
							<div class="flex items-center space-x-4">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600"
								>
									{index + 1}
								</div>
								<div>
									<h3 class="font-medium text-gray-900">{module.title}</h3>
									<p class="text-sm text-gray-600">{module.description}</p>
									<p class="mt-1 text-xs text-gray-500">⏱️ {module.duration}</p>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								{#if module.completed}
									<span class="text-sm text-green-600">✓ Completed</span>
								{:else}
									<button
										class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
									>
										Start Module
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Start Course Button -->
			<div class="text-center">
				<button
					class="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
				>
					Start Course
				</button>
				<p class="mt-2 text-sm text-gray-600">Begin your mental performance journey</p>
			</div>
		</main>
	{/if}
</div>
