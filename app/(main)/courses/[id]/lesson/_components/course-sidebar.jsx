import { CourseProgress } from '@/components/course-progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { ReviewModal } from './review-modal';
import { DownloadCertificate } from './download-certificate';
import { GiveReview } from './give-review';
import { SidebarModules } from './sidebar-modules';
import { getCourseDetails } from '@/queries/courses';
import { getLoggedInUser } from '@/lib/loggedin-user';
import { Watch } from '@/model/watch-model';
import { ObjectId } from 'mongoose';
import { getReport } from '@/queries/reports';
import { hasUserReviewedCourse } from '@/queries/testimonials';
import Quiz from './quiz';

export const CourseSidebar = async ({ courseId }) => {
	const course = await getCourseDetails(courseId);
	const loggedinUser = await getLoggedInUser();

	const report = await getReport({
		course: courseId,
		student: loggedinUser.id,
	});

	const hasReviewed = await hasUserReviewedCourse(loggedinUser.id, courseId);

	const totalCompletedModules = report?.totalCompletedModules
		? report?.totalCompletedModules.length
		: 0;

	const totalModules = course?.modules ? course.modules.length : 0;

	const totalProgress =
		totalModules > 0 ? (totalCompletedModules / totalModules) * 100 : 0;

	// Check if all modules are complete
	const allModulesComplete = totalProgress === 100;

	const updatedModules = await Promise.all(
		course?.modules.map(async (module) => {
			const moduleId = module._id.toString();
			const lessons = module?.lessonIds;

			const updatedLessons = await Promise.all(
				lessons.map(async (lesson) => {
					const lessonId = lesson._id.toString();
					const watch = await Watch.findOne({
						lesson: lessonId,
						module: moduleId,
						user: loggedinUser.id,
					}).lean();
					if (watch?.state === 'completed') {
						lesson.state = 'completed';
					}
					return lesson;
				})
			);

			return module;
		})
	);

	const updatedallModules = sanitizeData(updatedModules);

	// Sanitize function for handle ObjectID and Buffer
	function sanitizeData(data) {
		return JSON.parse(
			JSON.stringify(data, (key, value) => {
				if (value instanceof ObjectId) {
					return value.toString();
				}
				if (Buffer.isBuffer(value)) {
					return value.toString('base64');
				}
				return value;
			})
		);
	}

	const quizSetall = course?.quizSet;
	const quizSet = sanitizeData(quizSetall);

	// Prepare comprehensive quiz status
	const quizStatus = {
		taken: !!report?.quizAssessment,
		score: report?.quizScore ?? 0,
		passed: report?.quizPassed ?? false,
		takenAt: report?.quizTakenAt,
	};

	return (
		<>
			<div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
				<div className='p-8 flex flex-col border-b'>
					<h1 className='font-semibold'>{course.title}</h1>
					<div className='mt-10'>
						<CourseProgress variant='success' value={totalProgress} />
					</div>
				</div>
				<SidebarModules courseId={courseId} modules={updatedallModules} />
				<div className='w-full px-4 lg:px-14 pt-10 border-t'>
					{quizSet && (
						<Quiz
							courseId={courseId}
							quizSet={quizSet}
							quizStatus={quizStatus}
							modulesComplete={allModulesComplete}
						/>
					)}
				</div>
				<div className='w-full px-6 mb-5'>
					<GiveReview
						courseId={courseId}
						loginid={loggedinUser.id}
						hasReviewed={hasReviewed}
					/>
					<DownloadCertificate
						courseId={courseId}
						totalProgress={totalProgress}
						quizPassed={quizStatus.passed}
					/>
				</div>
			</div>
		</>
	);
};
