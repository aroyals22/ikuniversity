import { auth } from '@/auth';
import {
	getCourseDetails,
	getCourseDetailsByInstructor,
} from '@/queries/courses';
import { getReport } from '@/queries/reports';
import { getUserByEmail, getUserDetails } from '@/queries/users';
import { updateEnrollmentStatus } from '@/queries/enrollments';

export const COURSE_DATA = 'course';
export const ENROLLMENT_DATA = 'enrollment';
export const REVIEW_DATA = 'review';

const populateReviewData = async (reviews) => {
	const populatedReviews = await Promise.all(
		reviews.map(async (review) => {
			const student = await getUserDetails(review?.user?._id);
			review['studentName'] = `${student?.firstName} ${student?.lastName}`;
			return review;
		})
	);
	return populatedReviews;
};

export async function getInstructorDashboardData(dataType) {
	try {
		const session = await auth();
		const instructor = await getUserByEmail(session?.user?.email);
		const data = await getCourseDetailsByInstructor(instructor?.id, true);
		switch (dataType) {
			case COURSE_DATA:
				return data?.courses;

			case REVIEW_DATA:
				return populateReviewData(data?.reviews);

			case ENROLLMENT_DATA:
				return populateEnrollmentData(data?.enrollments);

			default:
				return data;
		}
	} catch (error) {
		console.error('Error getting instructor dashboard data:', error);
		throw error;
	}
}

const populateEnrollmentData = async (enrollments) => {
	const populatedEnrollments = await Promise.all(
		enrollments.map(async (enrollment) => {
			// Update student information
			const student = await getUserDetails(enrollment?.student?._id);
			enrollment['studentName'] = `${student?.firstName} ${student?.lastName}`;
			enrollment['studentEmail'] = student?.email;

			// Update quiz and Progress info
			const filter = {
				course: enrollment?.course?._id,
				student: enrollment?.student?._id,
			};

			const report = await getReport(filter);
			enrollment['progress'] = 0;
			enrollment['quizScore'] = 'Not taken'; // Default if no quiz taken

			if (report) {
				// Calculate Progress
				const course = await getCourseDetails(enrollment?.course?._id);
				const totalModules = course?.modules?.length ?? 0;
				const totalCompletedModules =
					report?.totalCompletedModules?.length ?? 0;
				const progress =
					totalModules > 0
						? Math.round((totalCompletedModules / totalModules) * 100)
						: 0;
				enrollment['progress'] = progress;

				// Get Quiz Score
				if (report.quizAssessment) {
					const score = report.quizScore ?? 0;
					const passed = report.quizPassed ?? false;
					enrollment['quizScore'] = `${score}%${passed ? ' ✅' : ''}`;

					// Update enrollment status based on progress and quiz
					const currentStatus = enrollment.status;
					let newStatus = currentStatus;

					if (progress === 100 && passed) {
						newStatus = 'completed';
					} else if (progress > 0) {
						newStatus = 'in-progress';
					}

					// Only update if status actually changed
					if (newStatus !== currentStatus) {
						try {
							await updateEnrollmentStatus(enrollment._id, newStatus);
							enrollment.status = newStatus; // Update the local object too
						} catch (error) {
							console.error('Failed to update enrollment status:', error);
						}
					}
				}
			}
			return enrollment;
		})
	);
	return populatedEnrollments;
};