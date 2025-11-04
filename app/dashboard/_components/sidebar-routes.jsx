'use client';

import {
	BarChart,
	PlusCircle,
	BookOpen,
	BookA,
	Tags,
	UserPlus,
} from 'lucide-react';

import { SidebarItem } from './sidebar-item';

const routes = [
	{
		icon: BarChart,
		label: 'Analytics',
		href: '/dashboard',
	},
	{
		icon: BookOpen,
		label: 'Courses',
		href: '/dashboard/courses',
	},
	{
		icon: PlusCircle,
		label: 'Add Course',
		href: '/dashboard/courses/add',
	},
	{
		icon: Tags,
		label: 'Categories',
		href: '/dashboard/categories',
	},
	{
		icon: BookA,
		label: 'Quizzes',
		href: '/dashboard/quiz-sets',
	},
	{
		icon: UserPlus,
		label: 'Enroll User',
		href: '/dashboard/enroll',
	},
];

export const SidebarRoutes = () => {
	return (
		<div className='flex flex-col w-full'>
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
};