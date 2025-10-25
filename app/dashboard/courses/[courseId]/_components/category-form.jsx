'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateCourse } from '@/app/actions/course';

const formSchema = z.object({
	categoryIds: z.array(z.string()).min(1, {
		message: 'At least one category is required',
	}),
});

export const CategoryForm = ({ initialData, courseId, options }) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryIds: initialData?.categoryIds || [],
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values) => {
		try {
			await updateCourse(courseId, { category: values.categoryIds });
			toast.success('Course updated');
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong');
		}
	};

	// Get selected category labels for display
	const selectedCategories = options.filter((option) =>
		initialData?.categoryIds?.includes(option.id)
	);

	return (
		<div className='mt-6 border bg-gray-50 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course Categories
				<Button variant='ghost' onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className='h-4 w-4 mr-2' />
							Edit Categories
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div className='mt-2'>
					{selectedCategories.length > 0 ? (
						<div className='flex flex-wrap gap-2'>
							{selectedCategories.map((cat) => (
								<span
									key={cat.id}
									className='text-sm bg-primary/10 text-primary px-3 py-1 rounded-full'
								>
									{cat.label}
								</span>
							))}
						</div>
					) : (
						<p className='text-sm text-slate-500 italic'>No categories</p>
					)}
				</div>
			)}

			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 mt-4'
					>
						<FormField
							control={form.control}
							name='categoryIds'
							render={() => (
								<FormItem>
									<div className='space-y-2'>
										{options.map((category) => (
											<FormField
												key={category.id}
												control={form.control}
												name='categoryIds'
												render={({ field }) => {
													return (
														<FormItem
															key={category.id}
															className='flex flex-row items-start space-x-3 space-y-0'
														>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(category.id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					category.id,
																				])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== category.id
																					)
																				);
																	}}
																/>
															</FormControl>
															<FormLabel className='font-normal cursor-pointer'>
																{category.label}
															</FormLabel>
														</FormItem>
													);
												}}
											/>
										))}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-x-2'>
							<Button disabled={!isValid || isSubmitting} type='submit'>
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
