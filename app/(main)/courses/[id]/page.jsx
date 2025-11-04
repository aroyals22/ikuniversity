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

	// Get category IDs (handle both array and old single category format)
	// Get category IDs (handle ObjectId objects properly)
	const categoryIds = Array.isArray(course.category)
		? course.category.map((cat) => {
				// Handle ObjectId objects from populated queries
				if (cat && typeof cat === 'object' && cat._id) {
					return cat._id.toString();
				}
				// Handle direct ObjectId references
				return cat.toString();
			})
		: course.category
			? [course.category.toString()]
			: [];

	// Fetch related courses (pass first category ID, or all categories)
	const relatedCourses =
		categoryIds.length > 0
			? await getRelatedCourses(currentCourseId, categoryIds) // Pass all categories
			: [];

	// Get first lesson from first module for free preview
	const firstModule = course.modules?.sort((a, b) => a.order - b.order)[0];
	const firstLesson = firstModule?.lessonIds?.sort(
		(a, b) => a.order - b.order
	)[0];
	const previewVideoUrl = firstLesson?.video_url;

	return (
		<>
			<CourseDetailsIntro course={course} />

			{previewVideoUrl && (
				<section id='preview' className='bg-gray-50 py-4 scroll-mt-20'>
					<div className='container mx-auto px-4 max-w-4xl'>
						<div className='text-center mb-6'>
							<span className='inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm mb-3'>
								FREE PREVIEW
							</span>
							<h2 className='text-3xl font-bold text-gray-900'>
								Watch the First Lesson
							</h2>
						</div>
						<div className='rounded-lg overflow-hidden shadow-lg'>
							<PreviewPlayer videoUrl={previewVideoUrl} />
						</div>
						<p className='text-center text-gray-600 mt-4'>
							Have peace of mind that this course is for you
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