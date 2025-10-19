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
import { dbConnect } from '@/service/mongo'; // ← ADD THIS

export async function updateQuizSet(quizset, dataToUpdate) {
	try {
		await dbConnect(); // ← ADD THIS
		await Quizset.findByIdAndUpdate(quizset, dataToUpdate);
	} catch (error) {
		console.error('Error updating quiz set:', error);
		throw error;
	}
}

export async function addQuizToQuizSet(quizSetId, quizData) {
	try {
		await dbConnect(); // ← ADD THIS
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
	try {
		await dbConnect(); // ← ADD THIS
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
	try {
		await dbConnect(); // ← ADD THIS
		const quiz = await Quizset.findById(quizSetId);
		const res = await Quizset.findByIdAndUpdate(
			quizSetId,
			{ active: !quiz.active },
			{ lean: true }
		);
		return res.active;
	} catch (error) {
		console.error('Error changing quiz publish state:', error);
		throw error;
	}
}

export async function doCreateQuizSet(data) {
	try {
		await dbConnect(); // ← ADD THIS
		data['slug'] = getSlug(data.title);
		const createdQuizSet = await Quizset.create(data);
		return createdQuizSet?._id.toString();
	} catch (error) {
		console.error('Error creating quiz set:', error);
		throw error;
	}
}

export async function addQuizAssessment(courseId, quizSetId, answers) {
	try {
		await dbConnect(); // ← ADD THIS
		const loggedInUser = await getLoggedInUser();

		if (!loggedInUser) {
			throw new Error('User not authenticated');
		}

		// Get the quiz set with all questions
		const quizSet = await getQuizSetById(quizSetId);
		const quizzes = replaceMongoIdInArray(quizSet.quizIds);

		// Check if user already passed this quiz
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

		// Simplified scoring: Each question worth 1 point
		const totalQuestions = quizzes.length;
		const totalMarks = totalQuestions; // 1 point per question

		// Build assessment record with scoring
		let correctAnswers = 0;

		const assessmentRecord = quizzes.map((quiz) => {
			const obj = {};
			obj.quizId = new mongoose.Types.ObjectId(quiz.id);

			// Find if this quiz was attempted
			const studentAnswer = answers.find((a) => a.quizId === quiz.id);
			obj.attempted = !!studentAnswer;

			// Process options and check correctness
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

			// Check if answer is correct (1 point per correct answer)
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

		// Simple calculation: each correct answer = 1 point
		const earnedMarks = correctAnswers;
		const score =
			totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
		const passed = score >= 70;

		// If there's an existing assessment (retake), delete it
		if (existingReport?.quizAssessment) {
			await Assessment.findByIdAndDelete(existingReport.quizAssessment);
		}

		// Create new assessment with scoring
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

		// Update or create report with quiz status
		await createAssessmentReport({
			courseId: courseId,
			userId: loggedInUser.id,
			quizAssessment: assessment._id,
			quizScore: score,
			quizPassed: passed,
			quizTakenAt: new Date(),
		});

		// Revalidate the course layout to show updated quiz status in sidebar
		revalidatePath(`/courses/${courseId}`, 'layout');

		// Return results to show to user
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