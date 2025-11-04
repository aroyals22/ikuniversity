import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/queries/users';
import { EnrollmentForm } from './_components/EnrollmentForm';
import { getCourseList } from '@/queries/courses';

const EnrollPage = async () => {
	const session = await auth();
	if (!session?.user) redirect('/login');

	const instructor = await getUserByEmail(session.user.email);
	if (instructor?.role !== 'instructor') redirect('/login');

	// Get all courses for the dropdown
	const courses = await getCourseList();

	return (
		<div className='p-6'>
			<div className='max-w-2xl mx-auto'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold'>Manual User Enrollment</h1>
					<p className='text-gray-600 mt-2'>
						Enroll users who have paid via purchase order. Users must register
						an account first at ikutraining.com/register
					</p>
				</div>

				<EnrollmentForm courses={courses} />
			</div>
		</div>
	);
};

export default EnrollPage;
