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
