'use server';
import { Course } from '@/model/course-model';
import { create } from '@/queries/courses';
import { getLoggedInUser } from '@/lib/loggedin-user';
import mongoose from 'mongoose';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';

export async function createCourse(data) {
	await dbConnect();
	try {
		const loggedinUser = await getLoggedInUser();
		data['instructor'] = loggedinUser?.id;
		const course = await create(data);

		// Revalidate pages that show course lists
		revalidatePath('/dashboard/courses');
		revalidatePath('/courses');
		revalidatePath('/');

		return course;
	} catch (e) {
		throw new Error(e);
	}
}

export async function updateCourse(courseId, dataToUpdate) {
	await dbConnect();
	try {
		await Course.findByIdAndUpdate(courseId, dataToUpdate);

		// Revalidate dashboard pages
		revalidatePath(`/dashboard/courses/${courseId}`);
		revalidatePath('/dashboard/courses');

		// Revalidate public course pages
		revalidatePath(`/courses/${courseId}`);
		revalidatePath('/courses');

		// Revalidate homepage
		revalidatePath('/');

		// If categories were updated, revalidate category pages
		if (dataToUpdate.category) {
			revalidatePath('/categories', 'page');
		}
	} catch (e) {
		throw new Error(e);
	}
}

export async function changeCoursePublishState(courseId) {
	await dbConnect();

	const course = await Course.findById(courseId);
	try {
		const res = await Course.findByIdAndUpdate(
			courseId,
			{ active: !course.active },
			{ new: true, lean: true }
		);

		revalidatePath(`/dashboard/courses/${courseId}`);
		revalidatePath('/dashboard/courses');
		revalidatePath('/courses');
		revalidatePath('/');

		return res.active;
	} catch (error) {
		throw new Error(error);
	}
}

export async function deleteCourse(courseId) {
	await dbConnect();
	try {
		await Course.findByIdAndDelete(courseId);

		revalidatePath('/dashboard/courses');
		revalidatePath('/courses');
		revalidatePath('/');
	} catch (err) {
		throw new Error(err);
	}
}

export async function updateQuizSetForCourse(courseId, dataUpdated) {
	await dbConnect();

	const data = {};
	data['quizSet'] = new mongoose.Types.ObjectId(dataUpdated.quizSetId);
	try {
		await Course.findByIdAndUpdate(courseId, data);

		revalidatePath(`/dashboard/courses/${courseId}`);
		revalidatePath(`/courses/${courseId}`);
		revalidatePath('/');
	} catch (error) {
		throw new Error(error);
	}
}