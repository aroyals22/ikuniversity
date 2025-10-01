import { Course } from '@/model/course-model';
import { Category } from '@/model/category-model';
import { User } from '@/model/user-model';
import { Testimonial } from '@/model/testimonial-model';
import { Module } from '@/model/module-model';
import { replaceMongoIdInObject } from '@/lib/convertData';
import { replaceMongoIdInArray } from './../lib/convertData';
import { dbConnect } from '@/service/mongo';
import { getEnrollmentsForCourse } from './enrollments';
import { getTestimonialsForCourse } from './testimonials';

export async function getCourseList() {
	await dbConnect();
	const courses = await Course.find({})
		.select([
			'title',
			'subtitle',
			'thumbnail',
			'modules',
			'price',
			'category',
			'instructor',
		])
		.populate({
			path: 'category',
			model: Category,
		})
		.populate({
			path: 'instructor',
			model: User,
		})
		.populate({
			path: 'testimonials',
			model: Testimonial,
		})
		.populate({
			path: 'modules',
			model: Module,
		})
		.lean();
	return replaceMongoIdInArray(courses);
}

export async function getCourseDetails(id) {
	await dbConnect();
	const course = await Course.findById(id)
		.populate({
			path: 'category',
			model: Category,
		})
		.populate({
			path: 'instructor',
			model: User,
		})
		.populate({
			path: 'testimonials',
			model: Testimonial,
			populate: {
				path: 'user',
				model: User,
			},
		})
		.populate({
			path: 'modules',
			model: Module,
		})
		.lean();
	return replaceMongoIdInObject(course);
}

function groupBy(array, keyFn) {
	return array.reduce((acc, item) => {
		const key = keyFn(item);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(item);
		return acc;
	}, {});
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
	await dbConnect();
	const courses = await Course.find({ instructor: instructorId })
		.populate({ path: 'category', model: Category })
		.populate({ path: 'instructor', model: User })
		.lean();

	const enrollments = await Promise.all(
		courses.map(async (course) => {
			const enrollment = await getEnrollmentsForCourse(course._id.toString());
			return enrollment;
		})
	);
	// console.log(enrollments);

	//group enrollments by courses

	const groupByCourses = groupBy(enrollments.flat(), (item) => item.course);

	const totalRevenue = courses.reduce((acc, course) => {
		const enrollmentsForCourse = groupByCourses[course._id] || [];
		return acc + enrollmentsForCourse.length * course.price;
	}, 0);
	// console.log(totalRevenue);
	//calc revenue

	const totalEnrollments = enrollments.reduce((acc, obj) => {
		return acc + obj.length;
	}, 0);

	const tesimonials = await Promise.all(
		courses.map(async (course) => {
			const tesimonial = await getTestimonialsForCourse(course._id.toString());
			return tesimonial;
		})
	);

	const totalTestimonials = tesimonials.flat();
	const avgRating =
		totalTestimonials.reduce(function (acc, obj) {
			return acc + obj.rating;
		}, 0) / totalTestimonials.length;

	const firstName =
		courses.length > 0 ? courses[0]?.instructor?.firstName : 'Unknown';
	const lastName =
		courses.length > 0 ? courses[0]?.instructor?.lastName : 'Unknown';
	const fullInsName = `${firstName} ${lastName}`;

	const Designation =
		courses.length > 0 ? courses[0]?.instructor?.designation : 'Unknown';

	const insImage =
		courses.length > 0 ? courses[0]?.instructor?.profilePicture : 'Unknown';

	if (expand) {
		return {
			courses: courses?.flat(),
			enrollments: enrollments?.flat(),
			reviews: totalTestimonials,
		};
	}

	return {
		courses: courses.length,
		enrollments: totalEnrollments,
		reviews: totalTestimonials.length,
		ratings: avgRating.toPrecision(2),
		inscourses: courses,
		revenue: totalRevenue,
		fullInsName,
		Designation,
		insImage,
	};
}