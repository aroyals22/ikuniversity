import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export const SidebarLessonItem = ({ courseId, lesson, module }) => {
	const isCompleted = (lesson) => {
		return lesson?.state === 'completed';
	};

	return (
		<Link
			href={`/courses/${courseId}/lesson?name=${lesson.slug}&module=${module}`}
			className={cn(
				'flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600',
				isCompleted(lesson) && 'text-emerald-700 hover:text-emerald-700'
			)}
		>
			<div className='flex items-center gap-x-2'>
				{isCompleted(lesson) ? (
					<CheckCircle size={16} className='text-emerald-700' />
				) : (
					<PlayCircle size={16} className='text-slate-700' />
				)}
				{lesson.title}
			</div>
		</Link>
	);
};