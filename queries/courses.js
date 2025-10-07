import { Course } from '@/model/course-model';
import { Category } from '@/model/category-model';
import { User } from '@/model/user-model';
import { Testimonial } from '@/model/testimonial-model';
import { Module } from '@/model/module.model';
import { replaceMongoIdInObject } from '@/lib/convertData';
import { replaceMongoIdInArray } from './../lib/convertData';
import { dbConnect } from '@/service/mongo';
import { getEnrollmentsForCourse } from './enrollments';
import { getTestimonialsForCourse } from './testimonials';
import { Lesson } from '@/model/lesson.model';
import { Quizset } from '@/model/quizset-model';
import { Quiz } from '@/model/quizzes-model';
import mongoose from 'mongoose';

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
			populate: {
				path: 'lessonIds',
				model: Lesson,
			},
		})
		.populate({
			path: 'quizSet',
			model: Quizset,
			populate: {
				path: 'quizIds',
				model: Quiz,
			},
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
	}, {});
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
	console.log(
		'[1] Starting getCourseDetailsByInstructor for instructor:',
		instructorId
	);
	await dbConnect();
	console.log('[2] DB connected');

	const publishCourses = await Course.find({
		instructor: instructorId,
		active: true,
	})
		.populate({ path: 'category', model: Category })
		.populate({ path: 'testimonials', model: Testimonial })
		.populate({ path: 'instructor', model: User })
		.lean();

	console.log('[3] Found courses:', publishCourses.length);

	const enrollments = await Promise.all(
		publishCourses.map(async (course, index) => {
			console.log(
				`[4.${index}] Getting enrollments for course:`,
				course._id.toString()
			);
			const enrollment = await getEnrollmentsForCourse(course._id.toString());
			console.log(`[4.${index}] Got enrollments:`, JSON.stringify(enrollment));
			return enrollment;
		})
	);

	console.log('[5] All enrollments fetched. Count:', enrollments.length);
	console.log('[5.1] Enrollments structure:', JSON.stringify(enrollments));
	
	console.log('[6] About to flatten enrollments');
	const flatEnrollments = enrollments.flat();
	console.log('[6.1] Flattened enrollments count:', flatEnrollments.length);

	console.log('[7] About to group by course');
	const groupByCourses = groupBy(flatEnrollments, (item) => {
		console.log('[7.1] Grouping item:', JSON.stringify(item));
		return item.course;
	});
	console.log('[8] Grouped successfully');

	console.log('[9] About to calculate totalRevenue');
	const totalRevenue = publishCourses.reduce((acc, course) => {
		const enrollmentsForCourse = groupByCourses[course._id] || [];
		console.log(
			'[9.1] Revenue for course',
			course._id,
			':',
			enrollmentsForCourse.length,
			'*',
			course.price
		);
		return acc + enrollmentsForCourse.length * course.price;
	}, 0);
	console.log('[10] Total revenue calculated:', totalRevenue);

	console.log('[11] About to calculate totalEnrollments');
	const totalEnrollments = enrollments.reduce((acc, obj, index) => {
		console.log(
			`[11.${index}] Processing enrollment array:`,
			obj ? obj.length : 'undefined'
		);
		return acc + (obj ? obj.length : 0);
	}, 0);
	console.log('[12] Total enrollments calculated:', totalEnrollments);

	console.log('[13] About to fetch testimonials');
	const tesimonials = await Promise.all(
		publishCourses.map(async (course, index) => {
			console.log(
				`[14.${index}] Getting testimonials for course:`,
				course._id.toString()
			);
			const tesimonial = await getTestimonialsForCourse(course._id.toString());
			console.log(
				`[14.${index}] Got testimonials:`,
				tesimonial ? tesimonial.length : 'null'
			);
			return tesimonial;
		})
	);
	console.log('[15] All testimonials fetched');

	const totalTestimonials = tesimonials.flat();
	console.log('[16] Flattened testimonials count:', totalTestimonials.length);

	console.log('[17] About to calculate avgRating');
	const avgRating =
		totalTestimonials.length > 0
			? totalTestimonials.reduce(function (acc, obj, index) {
					console.log(`[17.${index}] Rating:`, obj ? obj.rating : 'undefined');
					return acc + (obj.rating || 0);
				}, 0) / totalTestimonials.length
			: 0;
	console.log('[18] Avg rating calculated:', avgRating);

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

	console.log('[19] About to return results');

	if (expand) {
		const allCourses = await Course.find({
			instructor: instructorId,
		}).lean();
		return {
			courses: allCourses?.flat(),
			enrollments: flatEnrollments,
			reviews: totalTestimonials,
		};
	}

	return {
		courses: publishCourses.length,
		enrollments: totalEnrollments,
		reviews: totalTestimonials.length,
		ratings: avgRating > 0 ? avgRating.toPrecision(2) : '0',
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

export async function getCoursesByCategory(categoryId) {
	await dbConnect();
	try {
		const courses = await Course.find({ category: categoryId })
			.populate('category')
			.lean();
		return courses;
	} catch (error) {
		throw new Error(error);
	}
}

export const getCategoryById = async (categoryId) => {
	await dbConnect();
	try {
		const category = await Category.findById(categoryId);
		return category;
	} catch (error) {
		throw new Error(error);
	}
};

export async function getRelatedCourses(currentCourseId, categoryId) {
	await dbConnect();
	try {
		const currentCourseObjectId = new mongoose.Types.ObjectId(currentCourseId);
		const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
		const relatedCourses = await Course.find({
			category: categoryObjectId,
			_id: { $ne: currentCourseObjectId },
			active: true,
		})
			.select('title thumbnail price')
			.lean();
		return relatedCourses;
	} catch (error) {
		throw new Error(error);
	}
}