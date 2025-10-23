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
				<section className='bg-gray-50 py-12'>
					<div className='container mx-auto px-4 max-w-4xl'>
						<h2 className='text-3xl font-semi-bold text-center mb-8'>
							Free access to first lesson!
						</h2>
						<div className='rounded-lg overflow-hidden shadow-lg'>
							<PreviewPlayer videoUrl={previewVideoUrl} />
						</div>
						<p className='text-center text-gray-600 mt-4'>
							Have peace of mind that this course is for you.
						</p>
					</div>
				</section>
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