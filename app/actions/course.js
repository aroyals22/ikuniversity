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
		return course;
	} catch (e) {
		throw new Error(e);
	}
}

export async function updateCourse(courseId, dataToUpdate) {
	await dbConnect();
	try {
		await Course.findByIdAndUpdate(courseId, dataToUpdate);
		revalidatePath(`/dashboard/courses/${courseId}`);
		revalidatePath('/dashboard/courses');
		revalidatePath(`/courses/${courseId}`); // Public course detail page
		revalidatePath('/courses'); // Public courses listing page
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
	} catch (error) {
		throw new Error(error);
	}
}