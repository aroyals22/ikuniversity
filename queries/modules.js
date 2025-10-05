import { Module } from '@/model/module.model';
import { Lesson } from '@/model/lesson.model';
import { replaceMongoIdInObject } from '@/lib/convertData';
import { dbConnect } from '@/service/mongo';

export async function create(moduleData) {
	await dbConnect();
	try {
		const module = await Module.create(moduleData);
		return JSON.parse(JSON.stringify(module));
	} catch (error) {
		throw new Error(error);
	}
}

export async function getModule(moduleId) {
	await dbConnect();
	try {
		const module = await Module.findById(moduleId)
			.populate({
				path: 'lessonIds',
				model: Lesson,
			})
			.lean();
		return replaceMongoIdInObject(module);
	} catch (error) {
		throw new Error(error);
	}
}

export async function getModuleBySlug(moduleSlug) {
	try {
		const module = await Module.findOne({ slug: moduleSlug }).lean();
		return replaceMongoIdInObject(module);
	} catch (error) {
		throw new Error(error);
	}
}