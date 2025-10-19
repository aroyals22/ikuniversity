import { getAllQuizSets } from '@/queries/quizzes';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const QuizSets = async () => {
	const quizSetsall = await getAllQuizSets();
	
	const mappedQuizSets = quizSetsall.map((q) => {
		return {
			id: q.id,
			title: q.title,
			isPublished: q.active,
			totalQuiz: q.quizIds.length,
		};
	});
	
	return (
		<div className='p-6'>
			{/* TEMPORARY DEBUG */}
			<div className='mb-4 p-4 bg-yellow-100 border-2 border-yellow-600 rounded text-sm'>
				<p className='font-bold text-lg mb-2'>🐛 Debug Info:</p>
				<p className='mb-2'>
					<strong>Total quiz sets from DB:</strong> {quizSetsall.length}
				</p>
				<div className='bg-white p-2 rounded border border-gray-300 overflow-auto max-h-60'>
					<pre className='text-xs'>
						{JSON.stringify(mappedQuizSets, null, 2)}
					</pre>
				</div>
			</div>

			<DataTable columns={columns} data={mappedQuizSets} />
		</div>
	);
};

export default QuizSets;