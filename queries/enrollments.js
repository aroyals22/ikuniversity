import {
	replaceMongoIdInArray,
	replaceMongoIdInObject,
} from '@/lib/convertData';
import { Enrollment } from '@/model/enrollment-model';
import { Course } from '@/model/course-model';
import { dbConnect } from '@/service/mongo';

export async function getEnrollmentsForCourse(courseId) {
	await dbConnect();
	const enrollments = await Enrollment.find({ course: courseId }).lean();
	return replaceMongoIdInArray(enrollments);
}

export async function updateEnrollmentStatus(enrollmentId, newStatus) {
	await dbConnect();
	try {
		await Enrollment.findByIdAndUpdate(enrollmentId, {
			status: newStatus,
		});
		console.log(`Enrollment ${enrollmentId} status updated to: ${newStatus}`);
	} catch (error) {
		console.error('Failed to update enrollment status:', error);
		throw new Error(error);
	}
}




export async function enrollForCourse(courseId, userId, paymentMethod) {
	await dbConnect();
	const newEnrollment = {
		course: courseId,
		student: userId,
		method: paymentMethod,
		enrollment_date: Date.now(),
		status: 'not-started',
	};
	try {
		const response = await Enrollment.create(newEnrollment);
		return response;
	} catch (error) {
		throw new Error(error);
	}
}

export async function getEnrollmentsForUser(userId) {
	await dbConnect();
	try {
		const enrollments = await Enrollment.find({ student: userId })
			.populate({
				path: 'course',
				model: Course,
			})
			.lean();
		return replaceMongoIdInArray(enrollments);
	} catch (err) {
		throw new Error(err);
	}
}

export async function hasEnrollmentForCourse(courseId, studentId) {
	await dbConnect();
	try {
		const enrollment = await Enrollment.findOne({
			course: courseId,
			student: studentId,
		})
			.populate({
				path: 'course',
				model: Course,
			})
			.lean();

		if (!enrollment) return false;

		return true;
	} catch (error) {
		throw new Error(error);
	}
}