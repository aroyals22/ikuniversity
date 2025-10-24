'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory } from '@/app/actions/category';

export const AddCategoryForm = () => {
	const [title, setTitle] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error('Category name is required');
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createCategory(title);

			if (result.success) {
				toast.success('Category added successfully');
				setTitle('');
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
			<form onSubmit={handleSubmit} className='flex gap-2'>
				<Input
					placeholder='Category name (e.g., Verification, Calibration)'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isSubmitting}
					className='flex-1'
				/>
				<Button type='submit' disabled={isSubmitting || !title.trim()}>
					<PlusCircle className='h-4 w-4 mr-2' />
					{isSubmitting ? 'Adding...' : 'Add Category'}
				</Button>
			</form>
		</div>
	);
};
