import CourseDetailsIntro from './_components/CourseDetailsIntro';
import CourseDetails from './_components/CourseDetails';
import Testimonials from './_components/Testimonials';
import RelatedCourses from './_components/RelatedCourses';
import { getCourseDetails, getRelatedCourses } from '@/queries/courses';
import { replaceMongoIdInArray } from '@/lib/convertData';
import { notFound } from 'next/navigation';

export default async function SingleCoursePage({ params }) {
	const { id } = await params;

	const course = await getCourseDetails(id);
	if (!course) return notFound();

	const currentCourseId = course.id.toString();
	const categoryId = course.category._id.toString();

	// Fetch related courses
	const relatedCourses = await getRelatedCourses(currentCourseId, categoryId);

	return (
		<>
			<CourseDetailsIntro course={course} />
			<CourseDetails course={course} />
			{course.testimonials?.length ? (
				<Testimonials
					testimonials={replaceMongoIdInArray(course.testimonials)}
				/>
			) : null}
			<RelatedCourses relatedCourses={relatedCourses} />
		</>
	);
}
