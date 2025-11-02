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
			? await getRelatedCourses(currentCourseId, categoryIds[0])
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

			{/* Free Preview Section */}
			{previewVideoUrl && (
				<section id='preview' className='bg-gray-50 py-4 scroll-mt-20'>
					<div className='container mx-auto px-4 max-w-4xl'>
						<h2 className='text-3xl font-semibold text-center mb-4'>
							<span className='relative inline-flex'>
								<span className='bg-gradient-to-r from-[#670c0c] via-[#dc2626] to-[#f59e0b] blur-lg filter opacity-30 w-full h-full absolute inset-0'></span>
								<span className='relative'>Free access to first lesson!</span>
							</span>
						</h2>
						<div className='rounded-lg overflow-hidden shadow-lg'>
							<PreviewPlayer videoUrl={previewVideoUrl} />
						</div>
						<p className='text-center text-gray-600 mt-4 text-lg'>
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