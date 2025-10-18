import { dbConnect } from '@/service/mongo';
import { replaceMongoIdInObject } from '@/lib/convertData';
import { Assessment } from '@/model/assessment-model';
import { Report } from '@/model/report-model';
import { Module } from '@/model/module.model';
import mongoose from 'mongoose';
import { getCourseDetails } from './courses';

export async function getReport(filter) {
	await dbConnect();

	try {
		// Prevent useless queries
		if (!filter || Object.values(filter).every((v) => !v)) {
			return null;
		}

		const report = await Report.findOne(filter)
			.populate({ path: 'quizAssessment', model: Assessment })
			.lean();

		// If no matching report, return null instead of throwing
		if (!report) {
			return null;
		}

		// Ensure quizAssessment is always an array
		if (!report.quizAssessment) {
			report.quizAssessment = [];
		}

		return replaceMongoIdInObject(report);
	} catch (err) {
		console.error('Error in getReport:', err);
		throw err;
	}
}

export async function createWatchReport(data) {
	try {
		let report = await Report.findOne({
			course: data.courseId,
			student: data.userId,
		});

		if (!report) {
			report = await Report.create({
				course: data.courseId,
				student: data.userId,
			});
		}

		const foundLesson = report.totalCompletedLessons.find(
			(lessonId) => lessonId.toString() === data.lessonId
		);

		if (!foundLesson) {
			report.totalCompletedLessons.push(
				new mongoose.Types.ObjectId(data.lessonId)
			);
		}

		const module = await Module.findById(data.moduleId);
		const lessonIdsToCheck = module.lessonIds;
		const completedLessonsIds = report.totalCompletedLessons;

		// Fixed ObjectId comparison
		const isModuleComplete = lessonIdsToCheck.every((lesson) =>
			completedLessonsIds.some(
				(completedLesson) => completedLesson.toString() === lesson.toString()
			)
		);

		if (isModuleComplete) {
			const foundModule = report.totalCompletedModules.find(
				(module) => module.toString() === data.moduleId
			);
			if (!foundModule) {
				report.totalCompletedModules.push(
					new mongoose.Types.ObjectId(data.moduleId)
				);
			}
		}

		const course = await getCourseDetails(data.courseId);
		const modulesInCourse = course?.modules;
		const moduleCount = modulesInCourse?.length ?? 0;

		const completedModule = report.totalCompletedModules;
		const completedModuleCount = completedModule?.length ?? 0;

		if (completedModuleCount >= 1 && completedModuleCount === moduleCount) {
			report.completion_date = Date.now();
		}

		await report.save();
	} catch (error) {
		console.error('Error in createWatchReport:', error);
		throw error;
	}
}

export async function createAssessmentReport(data) {
	try {
		let report = await Report.findOne({
			course: data.courseId,
			student: data.userId,
		});

		if (!report) {
			// Create new report with quiz data
			report = await Report.create({
				course: data.courseId,
				student: data.userId,
				quizAssessment: data.quizAssessment,
				quizScore: data.quizScore,
				quizPassed: data.quizPassed,
				quizTakenAt: data.quizTakenAt,
			});
		} else {
			// Update existing report with quiz data
			report.quizAssessment = data.quizAssessment;
			report.quizScore = data.quizScore;
			report.quizPassed = data.quizPassed;
			report.quizTakenAt = data.quizTakenAt;
			await report.save();
		}

		return report;
	} catch (error) {
		console.error('Error in createAssessmentReport:', error);
		throw error;
	}
}