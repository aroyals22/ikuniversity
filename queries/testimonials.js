import {
	replaceMongoIdInArray,
	replaceMongoIdInObject,
} from '@/lib/convertData';
import { Testimonial } from '@/model/testimonial-model';
import { dbConnect } from '@/service/mongo';

export async function getTestimonialsForCourse(courseId) {
	await dbConnect();
	const testimonials = await Testimonial.find({ courseId: courseId }).lean();
	return replaceMongoIdInArray(testimonials);
}

export async function hasUserReviewedCourse(userId, courseId) {
	await dbConnect();
	const existingReview = await Testimonial.findOne({
		user: userId,
		courseId: courseId,
	}).lean();
	return !!existingReview;
}