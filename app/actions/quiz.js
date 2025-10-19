'use server';
import { getSlug, replaceMongoIdInArray } from '@/lib/convertData';
import { Quizset } from '@/model/quizset-model';
import { createQuiz, getQuizSetById } from '@/queries/quizzes';
import { Quiz } from '@/model/quizzes-model';
import mongoose from 'mongoose';
import { Assessment } from '@/model/assessment-model';
import { getLoggedInUser } from '@/lib/loggedin-user';
import { createAssessmentReport } from '@/queries/reports';
import { Report } from '@/model/report-model';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/service/mongo';

export async function updateQuizSet(quizset, dataToUpdate) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		await Quizset.findByIdAndUpdate(quizset, dataToUpdate);
	} catch (error) {
		console.error('Error updating quiz set:', error);
		throw error;
	}
}

export async function addQuizToQuizSet(quizSetId, quizData) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		const transformedQuizData = {};
		transformedQuizData['title'] = quizData['title'];
		transformedQuizData['description'] = quizData['description'];
		transformedQuizData['slug'] = getSlug(quizData['title']);
		transformedQuizData['options'] = [
			{
				text: quizData.optionA.label,
				is_correct: quizData.optionA.isTrue,
			},
			{
				text: quizData.optionB.label,
				is_correct: quizData.optionB.isTrue,
			},
			{
				text: quizData.optionC.label,
				is_correct: quizData.optionC.isTrue,
			},
			{
				text: quizData.optionD.label,
				is_correct: quizData.optionD.isTrue,
			},
		];
		const createdQuizId = await createQuiz(transformedQuizData);

		const quizSet = await Quizset.findById(quizSetId);
		quizSet.quizIds.push(createdQuizId);
		await quizSet.save();
	} catch (error) {
		console.error('Error adding quiz to quiz set:', error);
		throw error;
	}
}

export async function deleteQuiz(quizSetId, quizId) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		await Quizset.findByIdAndUpdate(quizSetId, {
			$pull: { quizIds: quizId },
		});

		await Quiz.findByIdAndDelete(quizId);
	} catch (error) {
		console.error('Error deleting quiz:', error);
		throw error;
	}
}

export async function changeQuizPublishState(quizSetId) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		const quiz = await Quizset.findById(quizSetId);
		const res = await Quizset.findByIdAndUpdate(
			quizSetId,
			{ active: !quiz.active },
			{ new: true, lean: true } // ← ALSO ADD "new: true" HERE
		);

		revalidatePath('/dashboard/quiz-sets'); // ← ADD THIS

		return res.active;
	} catch (error) {
		console.error('Error changing quiz publish state:', error);
		throw error;
	}
}

export async function doCreateQuizSet(data) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		data['slug'] = getSlug(data.title);
		const createdQuizSet = await Quizset.create(data);

		revalidatePath('/dashboard/quiz-sets'); // ← ADD THIS

		return createdQuizSet?._id.toString();
	} catch (error) {
		console.error('Error creating quiz set:', error);
		throw error;
	}
}

export async function addQuizAssessment(courseId, quizSetId, answers) {
	await dbConnect(); // ← MOVED BEFORE TRY
	try {
		const loggedInUser = await getLoggedInUser();

		if (!loggedInUser) {
			throw new Error('User not authenticated');
		}

		// ... rest of the function stays the same

		const quizSet = await getQuizSetById(quizSetId);
		const quizzes = replaceMongoIdInArray(quizSet.quizIds);

		const existingReport = await Report.findOne({
			course: courseId,
			student: loggedInUser.id,
		});

		if (existingReport?.quizPassed) {
			return {
				success: false,
				error: 'You have already passed this quiz and cannot retake it.',
				passed: true,
			};
		}

		const totalQuestions = quizzes.length;
		const totalMarks = totalQuestions;

		let correctAnswers = 0;

		const assessmentRecord = quizzes.map((quiz) => {
			const obj = {};
			obj.quizId = new mongoose.Types.ObjectId(quiz.id);

			const studentAnswer = answers.find((a) => a.quizId === quiz.id);
			obj.attempted = !!studentAnswer;

			const mergedOptions = quiz.options.map((o) => {
				const isSelected =
					studentAnswer?.options?.some(
						(selectedOpt) => selectedOpt.option === o.text
					) || false;

				return {
					option: o.text,
					isCorrect: o.is_correct,
					isSelected: isSelected,
				};
			});

			obj.options = mergedOptions;

			const correctOption = mergedOptions.find((o) => o.isCorrect);
			const selectedOption = mergedOptions.find((o) => o.isSelected);

			if (
				correctOption &&
				selectedOption &&
				correctOption.option === selectedOption.option
			) {
				correctAnswers++;
			}

			return obj;
		});

		const earnedMarks = correctAnswers;
		const score =
			totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
		const passed = score >= 70;

		if (existingReport?.quizAssessment) {
			await Assessment.findByIdAndDelete(existingReport.quizAssessment);
		}

		const assessmentEntry = {
			assessments: assessmentRecord,
			totalQuestions,
			correctAnswers,
			totalMarks,
			earnedMarks,
			score,
			passed,
		};

		const assessment = await Assessment.create(assessmentEntry);

		await createAssessmentReport({
			courseId: courseId,
			userId: loggedInUser.id,
			quizAssessment: assessment._id,
			quizScore: score,
			quizPassed: passed,
			quizTakenAt: new Date(),
		});

		revalidatePath(`/courses/${courseId}`, 'layout');

		return {
			success: true,
			score,
			passed,
			correctAnswers,
			totalQuestions,
			earnedMarks,
			totalMarks,
			assessmentId: assessment._id.toString(),
		};
	} catch (error) {
		console.error('Error adding quiz assessment:', error);
		return {
			success: false,
			error: error.message || 'Failed to submit quiz',
		};
	}
}