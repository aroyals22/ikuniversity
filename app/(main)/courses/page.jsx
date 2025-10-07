import { getCourseList } from '@/queries/courses';
import { getCategories } from '@/queries/categories';
import CoursesContent from './_components/CoursesContent';

const CoursesPage = async () => {
	const courses = await getCourseList();
	const categories = await getCategories();

	return (
		<section
			id='courses'
			className='container space-y-6 dark:bg-transparent py-6'
		>
			<CoursesContent courses={courses} categories={categories} />
		</section>
	);
};

export default CoursesPage;
