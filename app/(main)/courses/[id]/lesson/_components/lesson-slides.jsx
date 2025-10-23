'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const LessonSlides = ({ courseId, lesson, module }) => {
	const [api, setApi] = useState(null);
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [started, setStarted] = useState(false);
	const [completed, setCompleted] = useState(false);
	const router = useRouter();

	const slides = lesson?.slides || [];

	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on('select', () => {
			const newCurrent = api.selectedScrollSnap() + 1;
			setCurrent(newCurrent);

			// Mark complete when reaching last slide
			if (newCurrent === count && !completed) {
				setCompleted(true);
			}
		});
	}, [api, count, completed]);

	// Mark as started when component loads
	useEffect(() => {
		setStarted(true);
	}, []);

	// Handle marking lesson as started
	useEffect(() => {
		async function markAsStarted() {
			await fetch('/api/lesson-watch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					courseId: courseId,
					lessonId: lesson.id,
					moduleSlug: module,
					state: 'started',
					lastTime: 0,
				}),
			});
		}
		if (started) markAsStarted();
	}, [started, courseId, lesson.id, module]);

	// Handle marking lesson as completed
	useEffect(() => {
		async function markAsCompleted() {
			const response = await fetch('/api/lesson-watch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					courseId: courseId,
					lessonId: lesson.id,
					moduleSlug: module,
					state: 'completed',
					lastTime: 0,
				}),
			});
			if (response.status === 200) {
				router.refresh();
			}
		}
		if (completed) markAsCompleted();
	}, [completed, courseId, lesson.id, module, router]);

	if (!slides || slides.length === 0) {
		return (
			<div className='flex items-center justify-center h-96 bg-gray-100 rounded-lg'>
				<p className='text-gray-500'>No slides available for this lesson.</p>
			</div>
		);
	}

	return (
		<div className='w-full max-w-4xl mx-auto'>
			<Carousel setApi={setApi} className='w-full'>
				<CarouselContent>
					{slides.map((slide, index) => (
						<CarouselItem key={index}>
							<Card>
								<CardContent className='p-6'>
									{/* Image */}
									<div className='relative w-full h-96 mb-6'>
										<Image
											src={slide.image_url}
											alt={`Slide ${index + 1}`}
											fill
											className='object-contain rounded-lg'
										/>
									</div>

									{/* Text Content */}
									<div className='prose prose-sm max-w-none'>
										<div
											className='whitespace-pre-wrap'
											dangerouslySetInnerHTML={{ __html: slide.text_content }}
										/>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>

			{/* Pagination Dots */}
			<div className='mt-6 flex items-center justify-center gap-2'>
				{Array.from({ length: count }).map((_, index) => (
					<button
						key={index}
						onClick={() => api?.scrollTo(index)}
						className={cn('h-3.5 w-3.5 rounded-full border-2 transition-all', {
							'border-primary bg-primary': current === index + 1,
							'border-gray-300': current !== index + 1,
						})}
					/>
				))}
			</div>

			{/* Progress Indicator */}
			<div className='mt-4 text-center text-sm text-gray-600'>
				Slide {current} of {count}
				{current === count && completed && (
					<span className='ml-2 text-green-600 font-medium'>
						✓ Lesson Complete!
					</span>
				)}
			</div>
		</div>
	);
};
