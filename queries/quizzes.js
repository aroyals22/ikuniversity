import {
	replaceMongoIdInArray,
	replaceMongoIdInObject,
} from '@/lib/convertData';
import { Quizset } from '@/model/quizset-model';
import { Quiz } from '@/model/quizzes-model';
import { dbConnect } from '@/service/mongo'; // ← ADD THIS

export async function getAllQuizSets(excludeUnPublished) {
	await dbConnect(); // ← ADD THIS
	try {
		let quizSets = [];
		if (excludeUnPublished) {
			quizSets = await Quizset.find({ active: true }).lean();
		} else {
			quizSets = await Quizset.find().lean();
		}
		return replaceMongoIdInArray(quizSets);
	} catch (error) {
		console.error('Error getting quiz sets:', error);
		throw error;
	}
}

export async function getQuizSetById(id) {
	await dbConnect(); // ← ADD THIS
	try {
		const quizSet = await Quizset.findById(id)
			.populate({
				path: 'quizIds',
				model: Quiz,
			})
			.lean();
		return replaceMongoIdInObject(quizSet);
	} catch (error) {
		console.error('Error getting quiz set by id:', error);
		throw error;
	}
}

export async function createQuiz(quizData) {
	await dbConnect(); // ← ADD THIS
	try {
		const quiz = await Quiz.create(quizData);
		return quiz._id.toString();
	} catch (error) {
		console.error('Error creating quiz:', error);
		throw error;
	}
}