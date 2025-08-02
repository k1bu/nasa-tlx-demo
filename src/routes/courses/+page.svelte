<script lang="ts">
	import { goto } from '$app/navigation';
	import DashboardNav from '$lib/components/DashboardNav.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let user = data.user;

	// Course data with the mental performance curriculum
	const courses = [
		{
			id: 1,
			title: 'The Driver\'s Mind: Foundations of Mental Performance',
			description: 'Core concepts of attention, cognitive load, and how psychology influences driving. Introduces TAIS and mental profiling.',
			duration: '45 min',
			modules: 3,
			icon: '🧠',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner'
		},
		{
			id: 2,
			title: 'Flow & Focus: Building Deep Concentration Behind the Wheel',
			description: 'Techniques for sustained attention, entering flow states, and tuning out distractions. Managing Broad vs Focused attention.',
			duration: '60 min',
			modules: 4,
			icon: '🎯',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner'
		},
		{
			id: 3,
			title: 'Pressure-Proof: Performing When It Matters Most',
			description: 'Understanding pressure, mental and physiological signs of overload, and how to re-center mid-session. Integrates TAIS Performance Under Pressure.',
			duration: '75 min',
			modules: 5,
			icon: '⚡',
			status: 'available',
			progress: 0,
			difficulty: 'Intermediate'
		},
		{
			id: 4,
			title: 'Racecraft Decisions: Cognitive Speed & Strategic Thinking',
			description: 'How to make fast, accurate decisions under stress. Covers risk tolerance, decision heuristics, and situational awareness.',
			duration: '90 min',
			modules: 6,
			icon: '⚡',
			status: 'available',
			progress: 0,
			difficulty: 'Intermediate'
		},
		{
			id: 5,
			title: 'Mental Reset: Recovering From Mistakes in Real Time',
			description: 'What to do after a spin, lockup, or error. Rebuilding confidence quickly and returning to rhythm.',
			duration: '50 min',
			modules: 3,
			icon: '🔄',
			status: 'available',
			progress: 0,
			difficulty: 'Intermediate'
		},
		{
			id: 6,
			title: 'The Psychology of Speed: Mindset & Motivation',
			description: 'Understanding your own motivation, setting goals, and managing intensity levels. High Energy vs Low Energy driver archetypes.',
			duration: '65 min',
			modules: 4,
			icon: '🚀',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner'
		},
		{
			id: 7,
			title: 'Mental Mapping: Visualization & Track Learning Techniques',
			description: 'Using mental rehearsal, track maps, and cue-based learning to lock in new circuits. Builds on Focus and Internal Attention control.',
			duration: '80 min',
			modules: 5,
			icon: '🗺️',
			status: 'available',
			progress: 0,
			difficulty: 'Intermediate'
		},
		{
			id: 8,
			title: 'Pre-Race Routines & Rituals: Building a Personal Mental Prep Plan',
			description: 'How to mentally prepare for performance with intention. Routines, breathing, music, anchors, self-talk.',
			duration: '55 min',
			modules: 4,
			icon: '🎭',
			status: 'available',
			progress: 0,
			difficulty: 'Beginner'
		},
		{
			id: 9,
			title: 'Emotional Control: Managing Frustration, Fear, and Fatigue',
			description: 'How emotions influence your driving and how to respond adaptively. TAIS Frustration and Fatigue scales in practice.',
			duration: '70 min',
			modules: 5,
			icon: '😤',
			status: 'available',
			progress: 0,
			difficulty: 'Advanced'
		},
		{
			id: 10,
			title: 'Feedback-Driven: Mental Skills for Reviewing Data & Coaching',
			description: 'How to receive, process, and integrate feedback into performance improvement. Applies TAIS Expression of Ideas, Control, and Introversion.',
			duration: '60 min',
			modules: 4,
			icon: '📊',
			status: 'available',
			progress: 0,
			difficulty: 'Intermediate'
		},
		{
			id: 11,
			title: 'Sim to Track: Mental Skill Transfer & Cognitive Calibration',
			description: 'Bridging sim racing to real-world performance using mental cues and habits. Consistency of focus and intention across environments.',
			duration: '85 min',
			modules: 6,
			icon: '🎮',
			status: 'available',
			progress: 0,
			difficulty: 'Advanced'
		},
		{
			id: 12,
			title: 'Identity of a Driver: Confidence, Self-Talk, and Inner Voice',
			description: 'Building mental toughness, resilience, and a grounded sense of self as a competitor. Links to TAIS Self-Confidence and Control.',
			duration: '75 min',
			modules: 5,
			icon: '💪',
			status: 'available',
			progress: 0,
			difficulty: 'Advanced'
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'in-progress':
				return 'bg-blue-100 text-blue-800';
			case 'available':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getDifficultyColor(difficulty: string) {
		switch (difficulty) {
			case 'Beginner':
				return 'bg-green-100 text-green-800';
			case 'Intermediate':
				return 'bg-yellow-100 text-yellow-800';
			case 'Advanced':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>Mental Performance Courses - MindLap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<DashboardNav {user} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Mental Performance Curriculum</h1>
			<p class="mt-2 text-gray-600">
				Master the mental skills that separate good drivers from great ones. Our comprehensive curriculum covers everything from foundational concepts to advanced techniques.
			</p>
		</div>

		<!-- Progress Overview -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-lg font-semibold text-gray-900">Your Progress</h2>
					<p class="text-sm text-gray-600">Track your learning journey</p>
				</div>
				<div class="text-right">
					<div class="text-2xl font-bold text-blue-600">0%</div>
					<div class="text-sm text-gray-600">Complete</div>
				</div>
			</div>
			<div class="mt-4">
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div class="h-2 rounded-full bg-blue-600" style="width: 0%"></div>
				</div>
			</div>
		</div>

		<!-- Course Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each courses as course}
				<div class="rounded-lg bg-white p-6 shadow transition-all hover:shadow-lg cursor-pointer" on:click={() => goto(`/courses/${course.id}`)}>
					<!-- Course Header -->
					<div class="mb-4 flex items-start justify-between">
						<div class="text-3xl">{course.icon}</div>
						<div class="flex flex-col items-end space-y-1">
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusColor(course.status)}">
								{course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'Available'}
							</span>
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getDifficultyColor(course.difficulty)}">
								{course.difficulty}
							</span>
						</div>
					</div>

					<!-- Course Title -->
					<h3 class="mb-2 text-lg font-semibold text-gray-900 leading-tight">
						{course.title}
					</h3>

					<!-- Course Description -->
					<p class="mb-4 text-sm text-gray-600 leading-relaxed">
						{course.description}
					</p>

					<!-- Course Meta -->
					<div class="mb-4 flex items-center justify-between text-sm text-gray-500">
						<div class="flex items-center space-x-4">
							<span class="flex items-center">
								⏱️ {course.duration}
							</span>
							<span class="flex items-center">
								📚 {course.modules} modules
							</span>
						</div>
					</div>

					<!-- Progress Bar (if in progress) -->
					{#if course.status === 'in-progress'}
						<div class="mb-4">
							<div class="flex justify-between text-xs text-gray-600 mb-1">
								<span>Progress</span>
								<span>{course.progress}%</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200">
								<div class="h-2 rounded-full bg-blue-600" style="width: {course.progress}%"></div>
							</div>
						</div>
					{/if}

					<!-- Action Button -->
					<button 
						on:click={(e) => { e.stopPropagation(); goto(`/courses/${course.id}`); }}
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{course.status === 'completed' ? 'Review Course' : course.status === 'in-progress' ? 'Continue Learning' : 'Start Course'}
					</button>
				</div>
			{/each}
		</div>

		<!-- Learning Path Info -->
		<div class="mt-12 rounded-lg bg-blue-50 p-6">
			<div class="flex items-start">
				<div class="text-2xl mr-4">🎯</div>
				<div>
					<h3 class="text-lg font-semibold text-blue-900 mb-2">Recommended Learning Path</h3>
					<p class="text-blue-800 mb-4">
						For best results, we recommend completing these courses in order. Each course builds upon the previous ones, creating a comprehensive mental performance foundation.
					</p>
					<div class="text-sm text-blue-700">
						<strong>Beginner Track:</strong> Courses 1, 2, 6, 8 → <strong>Intermediate Track:</strong> Courses 3, 4, 5, 7, 10 → <strong>Advanced Track:</strong> Courses 9, 11, 12
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
