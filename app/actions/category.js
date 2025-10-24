'use server';

import { Category } from '@/model/category-model';
import { Course } from '@/model/course-model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';

export async function createCategory(data) {
	await dbConnect();

	try {
		const { title, thumbnail } = data;

		if (!title || !title.trim()) {
			throw new Error('Category name is required');
		}

		if (!thumbnail) {
			throw new Error('Category image is required');
		}

		// Check if category already exists
		const existingCategory = await Category.findOne({
			title: { $regex: new RegExp(`^${title}$`, 'i') },
		});

		if (existingCategory) {
			throw new Error('Category already exists');
		}

		const category = await Category.create({ title: title.trim(), thumbnail });

		revalidatePath('/dashboard/categories');
		revalidatePath('/dashboard/courses/add');

		return { success: true, category };
	} catch (error) {
		return { success: false, error: error.message };
	}
}


export async function deleteCategory(categoryId) {
	await dbConnect();

	try {
		// Check if any courses use this category
		const coursesUsingCategory = await Course.find({
			category: categoryId,
		});

		if (coursesUsingCategory.length > 0) {
			throw new Error(
				`Cannot delete category. ${coursesUsingCategory.length} course(s) are using it.`
			);
		}

		await Category.findByIdAndDelete(categoryId);

		revalidatePath('/dashboard/categories');
		revalidatePath('/dashboard/courses');

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
}
