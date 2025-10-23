'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateLesson } from '@/app/actions/lesson';
import Image from 'next/image';

export const SlidesForm = ({ initialData, courseId, lessonId }) => {
	const router = useRouter();
	const [slides, setSlides] = useState(initialData?.slides || []);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const addSlide = () => {
		if (slides.length >= 10) {
			toast.error('Maximum 10 slides per lesson');
			return;
		}

		const newSlide = {
			image_url: '',
			text_content: '',
			order: slides.length + 1,
		};

		setSlides([...slides, newSlide]);
	};

	const removeSlide = (index) => {
		const updatedSlides = slides.filter((_, i) => i !== index);
		// Reorder remaining slides
		const reorderedSlides = updatedSlides.map((slide, i) => ({
			...slide,
			order: i + 1,
		}));
		setSlides(reorderedSlides);
	};

	const updateSlideText = (index, text) => {
		const updatedSlides = [...slides];
		updatedSlides[index].text_content = text;
		setSlides(updatedSlides);
	};

	const updateSlideImage = async (index, file) => {
		try {
			const formData = new FormData();
			formData.append('files', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				const updatedSlides = [...slides];
				updatedSlides[index].image_url = data.url;
				setSlides(updatedSlides);
				toast.success('Image uploaded');
			} else {
				toast.error('Upload failed');
			}
		} catch (error) {
			toast.error('Upload failed');
		}
	};

	const saveSlides = async () => {
		// Validate all slides have images and text
		const invalidSlides = slides.filter(
			(slide) => !slide.image_url || !slide.text_content.trim()
		);

		if (invalidSlides.length > 0) {
			toast.error('All slides must have an image and text content');
			return;
		}

		setIsSubmitting(true);

		try {
			await updateLesson(lessonId, {
				type: 'slides',
				slides: slides,
			});
			toast.success('Slides saved successfully');
			router.refresh();
		} catch (error) {
			toast.error('Failed to save slides');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='mt-4 border rounded-lg p-4 bg-white'>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='font-medium'>Slides ({slides.length}/10)</h3>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={addSlide}
					disabled={slides.length >= 10}
				>
					<PlusCircle className='h-4 w-4 mr-2' />
					Add Slide
				</Button>
			</div>

			{slides.length === 0 && (
				<div className='text-center py-8 text-gray-500'>
					<p>No slides yet. Click "Add Slide" to get started.</p>
				</div>
			)}

			<div className='space-y-4'>
				{slides.map((slide, index) => (
					<div key={index} className='border rounded-lg p-4 bg-gray-50'>
						<div className='flex justify-between items-center mb-3'>
							<h4 className='font-medium'>Slide {index + 1}</h4>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => removeSlide(index)}
							>
								<Trash2 className='h-4 w-4 text-red-500' />
							</Button>
						</div>

						{/* Image Upload */}
						<div className='mb-4'>
							<label className='text-sm font-medium mb-2 block'>Image</label>
							{slide.image_url ? (
								<div className='relative aspect-video w-full max-w-md'>
									<Image
										src={slide.image_url}
										alt={`Slide ${index + 1}`}
										fill
										className='object-cover rounded-md'
									/>
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='absolute top-2 right-2'
										onClick={() => {
											const input = document.createElement('input');
											input.type = 'file';
											input.accept = 'image/*';
											input.onchange = (e) => {
												const file = e.target.files[0];
												if (file) updateSlideImage(index, file);
											};
											input.click();
										}}
									>
										Change
									</Button>
								</div>
							) : (
								<div
									className='border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100'
									onClick={() => {
										const input = document.createElement('input');
										input.type = 'file';
										input.accept = 'image/*';
										input.onchange = (e) => {
											const file = e.target.files[0];
											if (file) updateSlideImage(index, file);
										};
										input.click();
									}}
								>
									<ImageIcon className='h-8 w-8 mx-auto mb-2 text-gray-400' />
									<p className='text-sm text-gray-500'>Click to upload image</p>
								</div>
							)}
						</div>

						{/* Text Content */}
						<div>
							<label className='text-sm font-medium mb-2 block'>
								Text Content
							</label>
							<textarea
								className='w-full border rounded-md p-3 min-h-[100px]'
								placeholder='Add slide content...'
								value={slide.text_content}
								onChange={(e) => updateSlideText(index, e.target.value)}
							/>
							<p className='text-xs text-gray-500 mt-1'>
								Basic formatting will be added with Tiptap later
							</p>
						</div>
					</div>
				))}
			</div>

			{slides.length > 0 && (
				<div className='mt-6 flex justify-end'>
					<Button onClick={saveSlides} disabled={isSubmitting}>
						{isSubmitting ? 'Saving...' : 'Save Slides'}
					</Button>
				</div>
			)}
		</div>
	);
};
