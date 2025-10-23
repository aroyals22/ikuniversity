'use client';
import { IconBadge } from '@/components/icon-badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Video, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { LessonTitleForm } from './lesson-title-form';
import { LessonDescriptionForm } from './lesson-description-form';
import { VideoUrlForm } from './video-url-form';
import { LessonActions } from './lesson-action';
import { SlidesForm } from './slides-form';

export const LessonModal = ({ open, setOpen, courseId, lesson, moduleId }) => {
	const [lessonType, setLessonType] = useState(lesson?.type || 'video');

	function postDelete() {
		setOpen(false);
		onclose();
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className='sm:max-w-[1200px] w-[96%] overflow-y-auto max-h-[90vh]'
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Lesson Editor</DialogTitle>
					<DialogDescription>
						Customize and manage the settings for this lesson.
					</DialogDescription>
				</DialogHeader>
				<div>
					<div className='flex items-center justify-between'>
						<div className='w-full'>
							<Link
								href={`/dashboard/courses/${courseId}`}
								className='flex items-center text-sm hover:opacity-75 transition mb-6'
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to course setup
							</Link>
							<div className='flex items-center justify-end'>
								<LessonActions
									lesson={lesson}
									moduleId={moduleId}
									onDelete={postDelete}
								/>
							</div>
						</div>
					</div>

					{/* Lesson Type Selector */}
					<div className='flex gap-4 mb-8 mt-8'>
						<Button
							type='button'
							variant={lessonType === 'video' ? 'default' : 'outline'}
							onClick={() => setLessonType('video')}
							className='flex items-center gap-2'
						>
							<Video className='h-4 w-4' />
							Video Lesson
						</Button>
						<Button
							type='button'
							variant={lessonType === 'slides' ? 'default' : 'outline'}
							onClick={() => setLessonType('slides')}
							className='flex items-center gap-2'
						>
							<FileText className='h-4 w-4' />
							Slides Lesson
						</Button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-4'>
							<div>
								<div className='flex items-center gap-x-2'>
									<IconBadge icon={LayoutDashboard} />
									<h2 className='text-xl'>Customize Your chapter</h2>
								</div>
								<LessonTitleForm
									initialData={{ title: lesson?.title }}
									courseId={courseId}
									lessonId={lesson?.id}
								/>
								<LessonDescriptionForm
									initialData={{ description: lesson?.description }}
									courseId={courseId}
									lessonId={lesson?.id}
								/>
							</div>
						</div>

						{/* Conditional Content Based on Type */}
						<div>
							{lessonType === 'video' ? (
								<>
									<div className='flex items-center gap-x-2'>
										<IconBadge icon={Video} />
										<h2 className='text-xl'>Add a video</h2>
									</div>
									<VideoUrlForm
										initialData={{
											url: lesson?.video_url,
											duration: lesson?.duration,
										}}
										courseId={courseId}
										lessonId={lesson?.id}
									/>
								</>
							) : (
								<>
									<div className='flex items-center gap-x-2'>
										<IconBadge icon={FileText} />
										<h2 className='text-xl'>Add Slides</h2>
									</div>
									<SlidesForm
										initialData={{ slides: lesson?.slides }}
										courseId={courseId}
										lessonId={lesson?.id}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
