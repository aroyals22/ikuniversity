import React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import EnrollCourse from '@/components/EnrollCourse';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { hasEnrollmentForCourse } from '@/queries/enrollments';

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

const CourseDetailsIntro = async ({ course }) => {
	const session = await auth();
	const loggedInUser = await getUserByEmail(session?.user?.email);
	const hasEnrollment = await hasEnrollmentForCourse(
		course?.id,
		loggedInUser?.id
	);

	return (
		<div className='overflow-x-hidden grainy'>
			<section className='pt-12 sm:pt-16'>
				<div className='container'>
					<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
						<div className='max-w-2xl mx-auto text-center'>
							<h1 className='text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj'>
								<span className='relative inline-flex sm:inline'>
									<span className='bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0'></span>
									<span className='relative'>{course?.title}</span>
								</span>
							</h1>

							<p className='mt-5 px-6 text-lg text-gray-600 font-inter'>
								{course?.subtitle}
							</p>

							<div className='mt-6 flex flex-col items-center gap-3'>
								{/* Top row: Primary action + Price */}
								<div className='flex items-center justify-center flex-wrap gap-3'>
									{hasEnrollment ? (
										<Link
											href={`/courses/${course?.id}/lesson`}
											className={cn(buttonVariants({ size: 'lg' }))}
										>
											Access Course
										</Link>
									) : (
										<EnrollCourse courseId={course?.id} />
									)}
									<div className='px-6 py-3 bg-gray-100 text-gray-900 rounded-lg text-lg font-semibold'>
										Price: ${course?.price}
									</div>
								</div>

								{/* Bottom row: Secondary action - BLACK button */}
								<Link
									href='#preview'
									className={cn(buttonVariants({ size: 'lg' }))}
								>
									Preview Course
								</Link>
							</div>
						</div>
					</div>

					<div className='pb-12 mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 h-2/3'></div>
							<div className='relative mx-auto'>
								<div className='lg:max-w-3xl lg:mx-auto'>
									<Image
										className='w-full rounded-lg'
										width={768}
										height={463}
										src={getThumbnailUrl(course?.thumbnail)}
										alt={course?.title || 'Course thumbnail'}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default CourseDetailsIntro;