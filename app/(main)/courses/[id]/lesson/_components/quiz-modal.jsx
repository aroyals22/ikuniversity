'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { addQuizAssessment } from '@/app/actions/quiz';

function QuizModal({ quizzes, courseId, quizSetId, open, setOpen }) {
	const router = useRouter();
	const totalQuizzes = quizzes?.length || 0;
	const [quizIndex, setQuizIndex] = useState(0);
	const [answers, setAnswers] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const lastQuizIndex = totalQuizzes - 1;
	const currentQuiz = quizzes[quizIndex];

	const quizChangeHandler = (type) => {
		if (type === 'next' && quizIndex < lastQuizIndex) {
			setQuizIndex((prev) => prev + 1);
		}
		if (type === 'prev' && quizIndex > 0) {
			setQuizIndex((prev) => prev - 1);
		}
	};

	const updateAnswer = (quizId, selectedOption) => {
		setAnswers((prev) => ({
			...prev,
			[quizId]: selectedOption,
		}));
	};

	const submitQuiz = async () => {
		// Validate all questions answered
		if (Object.keys(answers).length < totalQuizzes) {
			toast.error('Please answer all questions before submitting.');
			return;
		}

		setIsSubmitting(true);

		try {
			// Transform answers to expected format
			const formattedAnswers = Object.entries(answers).map(
				([quizId, option]) => ({
					quizId,
					options: [{ option }],
				})
			);

			const result = await addQuizAssessment(
				courseId,
				quizSetId,
				formattedAnswers
			);

			if (!result.success) {
				toast.error(result.error || 'Failed to submit quiz');
				setIsSubmitting(false);
				return;
			}

			// Show results
			if (result.passed) {
				toast.success(
					`Congratulations! You passed with ${result.score}%! (${result.correctAnswers}/${result.totalQuestions})`
				);
			} else {
				toast.error(
					`You scored ${result.score}% (${result.correctAnswers}/${result.totalQuestions}). You need 70% to pass. Please try again.`
				);
			}

			// Close modal and refresh
			setOpen(false);
			setAnswers({});
			setQuizIndex(0);
			router.refresh();
		} catch (error) {
			console.error('Error submitting quiz:', error);
			toast.error('Problem submitting the quiz. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Get currently selected answer for this question
	const selectedAnswer = answers[currentQuiz?.id];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-[95%] block'>
				<DialogTitle className='sr-only'>Quiz Details</DialogTitle>
				<div className='pb-4 border-b border-border text-sm'>
					<span className='text-success inline-block mr-1'>
						{quizIndex + 1} / {totalQuizzes}
					</span>
					Question
					<span className='float-right text-xs text-muted-foreground'>
						Answered: {Object.keys(answers).length}/{totalQuizzes}
					</span>
				</div>
				<div className='py-4'>
					<h3 className='text-xl font-medium mb-6'>
						<svg
							className='text-success inline mr-2'
							strokeWidth='0'
							viewBox='0 0 512 512'
							height='1em'
							width='1em'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fill='currentColor'
								stroke='currentColor'
								d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z'
							></path>
						</svg>
						{currentQuiz?.title}
					</h3>
					{currentQuiz?.description && (
						<p className='text-sm text-muted-foreground mb-4'>
							{currentQuiz.description}
						</p>
					)}
				</div>
				<div className='grid md:grid-cols-2 gap-4 mb-6'>
					{currentQuiz?.options.map((option, index) => {
						const isSelected = selectedAnswer === option.label;
						return (
							<div key={`${currentQuiz.id}-${index}`}>
								<input
									className='peer sr-only'
									type='radio'
									name={`quiz-${currentQuiz.id}`}
									checked={isSelected}
									onChange={() => updateAnswer(currentQuiz.id, option.label)}
									id={`quiz-${currentQuiz.id}-option-${index}`}
								/>
								<Label
									className='border-2 border-border rounded-lg px-4 py-3 block cursor-pointer hover:bg-gray-50 transition-all font-normal peer-checked:border-green-500 peer-checked:bg-green-50'
									htmlFor={`quiz-${currentQuiz.id}-option-${index}`}
								>
									{option.label}
								</Label>
							</div>
						);
					})}
				</div>
				<DialogFooter className='flex flex-row gap-2 justify-between w-full sm:justify-between'>
					<Button
						className='gap-2'
						variant='outline'
						disabled={quizIndex === 0}
						onClick={() => quizChangeHandler('prev')}
					>
						<ArrowLeft className='h-4 w-4' /> Previous
					</Button>

					<Button
						className='gap-2 bg-green-600 hover:bg-green-700'
						disabled={
							isSubmitting || Object.keys(answers).length < totalQuizzes
						}
						onClick={submitQuiz}
					>
						{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
					</Button>

					<Button
						className='gap-2'
						variant='outline'
						disabled={quizIndex >= lastQuizIndex}
						onClick={() => quizChangeHandler('next')}
					>
						Next <ArrowRight className='h-4 w-4' />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default QuizModal;
