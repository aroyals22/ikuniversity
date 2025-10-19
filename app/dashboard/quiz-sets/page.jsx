import { getAllQuizSets } from '@/queries/quizzes';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const QuizSets = async () => {
	const quizSetsall = await getAllQuizSets();
	
	console.log('========== QUIZ SETS DEBUG ==========');
	console.log('Total quiz sets returned:', quizSetsall?.length);
	console.log('Quiz sets data:', JSON.stringify(quizSetsall, null, 2));
	console.log('====================================');

	const mappedQuizSets = quizSetsall.map((q) => {
		return {
			id: q.id,
			title: q.title,
			isPublished: q.active,
			totalQuiz: q.quizIds.length,
		};
	});

	console.log('Mapped quiz sets:', JSON.stringify(mappedQuizSets, null, 2));
	
	return (
		<div className='p-6'>
			<DataTable columns={columns} data={mappedQuizSets} />
		</div>
	);
};

export default QuizSets;