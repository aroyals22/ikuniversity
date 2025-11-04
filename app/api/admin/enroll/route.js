import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/queries/users';
import { enrollForCourse, hasEnrollmentForCourse } from '@/queries/enrollments';
import { getCourseDetails } from '@/queries/courses';
import { sendEmails } from '@/lib/emails';
import { dbConnect } from '@/service/mongo';

export async function POST(req) {
	await dbConnect(); // OUTSIDE try block

	try {
		// Check authentication
		const session = await auth();
		if (!session?.user?.email) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is instructor
		const instructor = await getUserByEmail(session.user.email);
		if (instructor?.role !== 'instructor') {
			return NextResponse.json(
				{ message: 'Unauthorized - Instructor access required' },
				{ status: 403 }
			);
		}

		// Parse request body
		const { email, courseIds, sendNotification } = await req.json();

		// Validate input
		if (!email || !courseIds || courseIds.length === 0) {
			return NextResponse.json(
				{ message: 'Email and at least one course are required' },
				{ status: 400 }
			);
		}

		// Check if user exists
		const student = await getUserByEmail(email);
		if (!student) {
			return NextResponse.json(
				{
					message:
						'User not found. They must register first at ikutraining.com/register',
				},
				{ status: 404 }
			);
		}

		// Track enrollment results
		const results = {
			enrolled: [],
			alreadyEnrolled: [],
			failed: [],
		};

		// Enroll in each course
		for (const courseId of courseIds) {
			try {
				// Check if already enrolled
				const alreadyEnrolled = await hasEnrollmentForCourse(
					courseId,
					student.id
				);

				if (alreadyEnrolled) {
					const course = await getCourseDetails(courseId);
					results.alreadyEnrolled.push(course.title);
					continue;
				}

				// Create enrollment
				await enrollForCourse(courseId, student.id, 'manual');

				const course = await getCourseDetails(courseId);
				results.enrolled.push(course.title);
			} catch (error) {
				console.error(`Failed to enroll in course ${courseId}:`, error);
				results.failed.push(courseId);
			}
		}

		// Send notification email if requested and enrollments were successful
		if (sendNotification && results.enrolled.length > 0) {
			const studentName = `${student.firstName} ${student.lastName}`;
			const courseList = results.enrolled.join(', ');

			const emailsToSend = [
				{
					to: email,
					subject: `You've been enrolled in ${results.enrolled.length} course${results.enrolled.length > 1 ? 's' : ''}`,
					message: `Hello ${studentName},\n\nYou have been enrolled in the following course(s):\n\n${courseList}\n\nLogin to ikutraining.com to start learning!\n\nBest regards,\nIkonix Training Team`,
				},
			];

			try {
				await sendEmails(emailsToSend);
			} catch (emailError) {
				console.error('Failed to send notification email:', emailError);
				// Don't fail the whole request if email fails
			}
		}

		// Build success message
		let message = '';
		if (results.enrolled.length > 0) {
			message += `Successfully enrolled in ${results.enrolled.length} course(s)`;
		}
		if (results.alreadyEnrolled.length > 0) {
			message += ` (${results.alreadyEnrolled.length} already enrolled)`;
		}
		if (results.failed.length > 0) {
			message += ` (${results.failed.length} failed)`;
		}

		return NextResponse.json(
			{
				message,
				results,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Enrollment error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
