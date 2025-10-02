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
	const courses = await Course.find({ active: true })
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
	const publishCourses = await Course.find({
		instructor: instructorId,
		active: true,
	})
		.populate({ path: 'category', model: Category })
		.populate({ path: 'testimonials', model: Testimonial })
		.populate({ path: 'instructor', model: User })
		.lean();

	const enrollments = await Promise.all(
		publishCourses.map(async (course) => {
			const enrollment = await getEnrollmentsForCourse(course._id.toString());
			return enrollment;
		})
	);
	// console.log(enrollments);

	//group enrollments by publishCourses

	const groupByCourses = groupBy(enrollments.flat(), (item) => item.course);

	const totalRevenue = publishCourses.reduce((acc, course) => {
		const enrollmentsForCourse = groupByCourses[course._id] || [];
		return acc + enrollmentsForCourse.length * course.price;
	}, 0);
	// console.log(totalRevenue);
	//calc revenue

	const totalEnrollments = enrollments.reduce((acc, obj) => {
		return acc + obj.length;
	}, 0);

	const tesimonials = await Promise.all(
		publishCourses.map(async (course) => {
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
		publishCourses.length > 0
			? publishCourses[0]?.instructor?.firstName
			: 'Unknown';
	const lastName =
		publishCourses.length > 0
			? publishCourses[0]?.instructor?.lastName
			: 'Unknown';
	const fullInsName = `${firstName} ${lastName}`;

	const Designation =
		publishCourses.length > 0
			? publishCourses[0]?.instructor?.designation
			: 'Unknown';

	const insImage =
		publishCourses.length > 0
			? publishCourses[0]?.instructor?.profilePicture
			: 'Unknown';

	if (expand) {
		const allCourses = await Course.find({
			instructor: instructorId,
		}).lean();
		return {
			courses: allCourses?.flat(),
			enrollments: enrollments?.flat(),
			reviews: totalTestimonials,
		};
	}

	return {
		courses: publishCourses.length,
		enrollments: totalEnrollments,
		reviews: totalTestimonials.length,
		ratings: avgRating.toPrecision(2),
		inscourses: publishCourses,
		revenue: totalRevenue,
		fullInsName,
		Designation,
		insImage,
	};
}

export async function create(courseData) {
	try {
		const course = await Course.create(courseData);
		return JSON.parse(JSON.stringify(course));
	} catch (error) {
		throw new Error(error);
	}
}