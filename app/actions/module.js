'use server';

import { Course } from '@/model/course-model';
import { create } from '@/queries/modules';
import { Module } from '@/model/module.model';
import mongoose from 'mongoose';
import { dbConnect } from '@/service/mongo';  // ← ADD THIS IMPORT

export async function createModule(data) {
	await dbConnect(); // ← ADD THIS
	try {
		const title = data.get('title');
		const slug = data.get('slug');
		const courseId = data.get('courseId');
		const order = data.get('order');

		const createdModule = await create({
			title,
			slug,
			course: courseId,
			order,
		});
		const course = await Course.findById(courseId);
		course.modules.push(createdModule._id);
		await course.save(); // ← ADD "await"

		return createdModule;
	} catch (e) {
		throw new Error(e);
	}
}

export async function reOrderModules(data) {
	await dbConnect(); // ← ADD THIS
	try {
		await Promise.all(
			data.map(async (element) => {
				await Module.findByIdAndUpdate(element.id, { order: element.position });
			})
		);
	} catch (e) {
		throw new Error(e);
	}
}

export async function updateModule(moduleId, data) {
	await dbConnect(); // ← ADD THIS
	try {
		await Module.findByIdAndUpdate(moduleId, data);
	} catch (error) {
		throw new Error(error); // ← Fixed: was "e", should be "error"
	}
}

export async function changeModulePublishState(moduleId) {
	await dbConnect(); // ← ADD THIS (before first findById)

	const module = await Module.findById(moduleId);
	try {
		const res = await Module.findByIdAndUpdate(
			moduleId,
			{ active: !module.active },
			{ new: true, lean: true } // ← ADD "new: true"
		);
		return res.active;
	} catch (error) {
		throw new Error(error);
	}
}

export async function deleteModule(moduleId, courseId) {
	await dbConnect(); // ← ADD THIS
	try {
		const course = await Course.findById(courseId);
		course.modules.pull(new mongoose.Types.ObjectId(moduleId));
		await Module.findByIdAndDelete(moduleId);
		await course.save(); // ← ADD "await"
	} catch (err) {
		throw new Error(err);
	}
}