'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteCategory } from '@/app/actions/category';

export const CategoryList = ({ categories }) => {
	const [deletingId, setDeletingId] = useState(null);
	const router = useRouter();

	const handleDelete = async (categoryId) => {
		if (!confirm('Are you sure you want to delete this category?')) {
			return;
		}

		setDeletingId(categoryId);

		try {
			const result = await deleteCategory(categoryId);

			if (result.success) {
				toast.success('Category deleted successfully');
				router.refresh();
			} else {
				toast.error(result.error || 'Failed to delete category');
			}
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setDeletingId(null);
		}
	};

	if (categories.length === 0) {
		return (
			<div className='text-center py-8 text-gray-500'>
				<p>No categories yet. Add your first category above!</p>
			</div>
		);
	}

	return (
		<div className='border rounded-lg divide-y'>
			{categories.map((category) => (
				<div
					key={category.id}
					className='flex items-center justify-between p-4 hover:bg-gray-50'
				>
					<span className='font-medium'>{category.title}</span>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => handleDelete(category.id)}
						disabled={deletingId === category.id}
					>
						<Trash2 className='h-4 w-4 text-red-500' />
					</Button>
				</div>
			))}
		</div>
	);
};
