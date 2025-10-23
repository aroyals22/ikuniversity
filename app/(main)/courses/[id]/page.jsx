import CourseDetailsIntro from './_components/CourseDetailsIntro';
import CourseDetails from './_components/CourseDetails';
import Testimonials from './_components/Testimonials';
import RelatedCourses from './_components/RelatedCourses';
import { PreviewPlayer } from './_components/PreviewPlayer';
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

	// Get first lesson from first module for free preview
	const firstModule = course.modules?.sort((a, b) => a.order - b.order)[0];
	const firstLesson = firstModule?.lessonIds?.sort(
		(a, b) => a.order - b.order
	)[0];
	const previewVideoUrl = firstLesson?.video_url;

	return (
		<>
			<CourseDetailsIntro course={course} />

			{/* Free Preview Section */}
			{previewVideoUrl && (
				<div className='container mx-auto px-4 py-8'>
					<h2 className='text-2xl font-bold mb-4'>Free Preview</h2>
					<PreviewPlayer videoUrl={previewVideoUrl} />
				</div>
			)}

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