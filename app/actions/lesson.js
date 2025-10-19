'use server';

import { Lesson } from '@/model/lesson.model';
import { Module } from '@/model/module.model';
import { create } from '@/queries/lessons';
import mongoose from 'mongoose';
import { dbConnect } from '@/service/mongo';  // ← ADD THIS IMPORT

export async function createLesson(data) {
	await dbConnect(); // ← ADD THIS
	try {
		const title = data.get('title');
		const slug = data.get('slug');
		const moduleId = data.get('moduleId');
		const order = data.get('order');

		const createdLesson = await create({ title, slug, order });

		const module = await Module.findById(moduleId);
		module.lessonIds.push(createdLesson._id);
		await module.save(); // ← ADD "await"

		return createdLesson;
	} catch (e) {
		throw new Error(e);
	}
}

export async function reOrderLesson(data) {
	await dbConnect(); // ← ADD THIS
	try {
		await Promise.all(
			data.map(async (element) => {
				await Lesson.findByIdAndUpdate(element.id, { order: element.position });
			})
		);
	} catch (e) {
		throw new Error(e);
	}
}

export async function updateLesson(lessonId, data) {
	await dbConnect(); // ← ADD THIS
	try {
		await Lesson.findByIdAndUpdate(lessonId, data);
	} catch (error) {
		throw new Error(error); // ← Fixed: was "e", should be "error"
	}
}

export async function changeLessonPublishState(lessonId) {
	await dbConnect(); // ← ADD THIS (before first findById)

	const lesson = await Lesson.findById(lessonId);
	try {
		const res = await Lesson.findByIdAndUpdate(
			lessonId,
			{ active: !lesson.active },
			{ new: true, lean: true } // ← ADD "new: true"
		);
		return res.active;
	} catch (error) {
		throw new Error(error);
	}
}

export async function deleteLesson(lessonId, moduleId) {
	await dbConnect(); // ← ADD THIS
	try {
		const module = await Module.findById(moduleId);
		module.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
		await Lesson.findByIdAndDelete(lessonId);
		await module.save(); // ← ADD "await"
	} catch (err) {
		throw new Error(err);
	}
}