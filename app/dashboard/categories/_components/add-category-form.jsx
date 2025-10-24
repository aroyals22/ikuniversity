'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory } from '@/app/actions/category';
import Image from 'next/image';

export const AddCategoryForm = () => {
	const [title, setTitle] = useState('');
	const [thumbnail, setThumbnail] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append('files', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				setThumbnail(data.url);
				toast.success('Image uploaded');
			} else {
				toast.error('Upload failed');
			}
		} catch (error) {
			toast.error('Upload failed');
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error('Category name is required');
			return;
		}

		if (!thumbnail) {
			toast.error('Category image is required');
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createCategory({ title, thumbnail });

			if (result.success) {
				toast.success('Category added successfully');
				setTitle('');
				setThumbnail('');
				router.refresh();
			} else {
				toast.error(result.error || 'Failed to add category');
			}
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='border rounded-lg p-4 bg-white'>
			<h3 className='text-lg font-medium mb-4'>Add New Category</h3>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Category Name */}
				<div>
					<label className='text-sm font-medium mb-2 block'>
						Category Name
					</label>
					<Input
						placeholder='e.g., Verification, Calibration'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						disabled={isSubmitting || isUploading}
					/>
				</div>

				{/* Image Upload */}
				<div>
					<label className='text-sm font-medium mb-2 block'>
						Category Image
					</label>
					{thumbnail ? (
						<div className='relative w-full aspect-video max-w-xs'>
							<Image
								src={thumbnail}
								alt='Category thumbnail'
								fill
								className='object-cover rounded-md'
							/>
							<Button
								type='button'
								variant='destructive'
								size='sm'
								className='absolute top-2 right-2'
								onClick={() => setThumbnail('')}
							>
								<X className='h-4 w-4' />
							</Button>
						</div>
					) : (
						<div
							className='border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50'
							onClick={() => document.getElementById('category-image').click()}
						>
							{isUploading ? (
								<p className='text-sm text-gray-500'>Uploading...</p>
							) : (
								<>
									<ImageIcon className='h-8 w-8 mx-auto mb-2 text-gray-400' />
									<p className='text-sm text-gray-500'>Click to upload image</p>
								</>
							)}
						</div>
					)}
					<input
						id='category-image'
						type='file'
						accept='image/*'
						className='hidden'
						onChange={handleImageUpload}
						disabled={isSubmitting || isUploading}
					/>
				</div>

				{/* Submit Button */}
				<Button
					type='submit'
					disabled={isSubmitting || isUploading || !title.trim() || !thumbnail}
					className='w-full'
				>
					<PlusCircle className='h-4 w-4 mr-2' />
					{isSubmitting ? 'Adding...' : 'Add Category'}
				</Button>
			</form>
		</div>
	);
};