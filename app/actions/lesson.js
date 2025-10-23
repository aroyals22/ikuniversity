'use server';

import { Lesson } from '@/model/lesson.model';
import { Module } from '@/model/module.model';
import { create } from '@/queries/lessons';
import mongoose from 'mongoose';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';

export async function createLesson(data) {
	await dbConnect();
	try {
		const title = data.get('title');
		const slug = data.get('slug');
		const moduleId = data.get('moduleId');
		const order = data.get('order');
		const type = data.get('type') || 'video'; // Get type, default to 'video'

		const createdLesson = await create({ title, slug, order, type });

		const module = await Module.findById(moduleId);
		module.lessonIds.push(createdLesson._id);
		await module.save();

		revalidatePath(`/dashboard/courses`);

		return createdLesson;
	} catch (e) {
		throw new Error(e);
	}
}
export async function reOrderLesson(data) {
	await dbConnect();
	try {
		await Promise.all(
			data.map(async (element) => {
				await Lesson.findByIdAndUpdate(element.id, { order: element.position });
			})
		);

		revalidatePath(`/dashboard/courses`);
	} catch (e) {
		throw new Error(e);
	}
}

export async function updateLesson(lessonId, data) {
	await dbConnect();
	try {
		await Lesson.findByIdAndUpdate(lessonId, data);

		revalidatePath(`/dashboard/courses`);
	} catch (error) {
		throw new Error(error);
	}
}

export async function changeLessonPublishState(lessonId) {
	await dbConnect();

	const lesson = await Lesson.findById(lessonId);
	try {
		const res = await Lesson.findByIdAndUpdate(
			lessonId,
			{ active: !lesson.active },
			{ new: true, lean: true }
		);

		revalidatePath(`/dashboard/courses`);

		return res.active;
	} catch (error) {
		throw new Error(error);
	}
}

export async function deleteLesson(lessonId, moduleId) {
	await dbConnect();
	try {
		const module = await Module.findById(moduleId);
		module.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
		await Lesson.findByIdAndDelete(lessonId);
		await module.save();

		revalidatePath(`/dashboard/courses`);
	} catch (err) {
		throw new Error(err);
	}
}