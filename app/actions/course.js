'use server';
import { Course } from '@/model/course-model';
import { create } from '@/queries/courses';
import { getLoggedInUser } from '@/lib/loggedin-user';
import mongoose from 'mongoose';
import { dbConnect } from '@/service/mongo'; // ← ADD THIS IMPORT

export async function createCourse(data) {
	// Note: dbConnect is called inside the `create` query function
	// So this one is OK as-is
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
	await dbConnect(); // ← ADD THIS
	try {
		await Course.findByIdAndUpdate(courseId, dataToUpdate);
	} catch (e) {
		throw new Error(e);
	}
}

export async function changeCoursePublishState(courseId) {
	await dbConnect(); // ← ADD THIS (before the first findById)

	const course = await Course.findById(courseId);
	try {
		const res = await Course.findByIdAndUpdate(
			courseId,
			{ active: !course.active },
			{ new: true, lean: true } // ← ADD "new: true"
		);
		return res.active;
	} catch (error) {
		throw new Error(error);
	}
}

export async function deleteCourse(courseId) {
	await dbConnect(); // ← ADD THIS
	try {
		await Course.findByIdAndDelete(courseId);
	} catch (err) {
		throw new Error(err);
	}
}

export async function updateQuizSetForCourse(courseId, dataUpdated) {
	await dbConnect(); // ← ADD THIS

	const data = {};
	data['quizSet'] = new mongoose.Types.ObjectId(dataUpdated.quizSetId);
	try {
		await Course.findByIdAndUpdate(courseId, data);
	} catch (error) {
		throw new Error(error); // ← Fixed: was "err", should be "error"
	}
}