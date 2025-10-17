import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { ArrowRightIcon } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import EnrollCourse from '@/components/EnrollCourse';

const CourseCard = ({ course }) => {
	// Helper function to handle both old (filename) and new (blob URL) thumbnails
	const getThumbnailUrl = (thumbnail) => {
		if (!thumbnail) {
			return '/assets/images/courses/placeholder.jpg';
		}

		// If it's a full URL (Vercel Blob), use it directly
		if (thumbnail.startsWith('http')) {
			return thumbnail;
		}

		// If it's just a filename (old courses), construct the path
		return `/assets/images/courses/${thumbnail}`;
	};

	return (
		<div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
			<Link key={course.id} href={`/courses/${course.id}`}>
				<div className='relative w-full aspect-video rounded-md overflow-hidden'>
					<Image
						src={getThumbnailUrl(course?.thumbnail)}
						alt={course?.title || 'Course thumbnail'}
						className='object-cover'
						fill
					/>
				</div>
				<div className='flex flex-col pt-2'>
					<div className='text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2'>
						{course?.title}
					</div>
					<p className='text-xs text-muted-foreground'>
						{course?.category?.title}
					</p>
					<div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
						<div className='flex items-center gap-x-1 text-slate-500'>
							<div>
								<BookOpen className='w-4' />
							</div>
							<span>{course?.modules?.length} Chapters</span>
						</div>
					</div>
				</div>
			</Link>

			<div className='flex items-center justify-between mt-4'>
				<p className='text-md md:text-sm font-medium text-slate-700'>
					{formatPrice(course?.price)}
				</p>

				<EnrollCourse asLink={true} courseId={course?.id} />
			</div>
		</div>
	);
};

export default CourseCard;