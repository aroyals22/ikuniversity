import CourseDetailsIntro from './_components/CourseDetailsIntro';
import CourseDetails from './_components/CourseDetails';
import Testimonials from './_components/Testimonials';
import RelatedCourses from './_components/RelatedCourses';
import { getCourseDetails } from '@/queries/courses';
import { replaceMongoIdInArray } from '@/lib/convertData';
import { notFound } from 'next/navigation';

export default async function SingleCoursePage({ params }) {
	const { id } = await params; // ⬅️ await params (server component)
	const course = await getCourseDetails(id);
	if (!course) return notFound();

	return (
		<>
			<CourseDetailsIntro course={course} />
			<CourseDetails course={course} />
			{course.testimonials?.length ? (
				<Testimonials
					testimonials={replaceMongoIdInArray(course.testimonials)}
				/>
			) : null}
			<RelatedCourses />
		</>
	);
}
