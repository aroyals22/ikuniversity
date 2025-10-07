'use server';

import { Course } from '@/model/course-model';
import { Testimonial } from '@/model/testimonial-model';

export async function createReview(data, loginid, courseId) {
	const { review, rating } = data;
	try {
		// Check if user already reviewed this course
		const existingReview = await Testimonial.findOne({
			user: loginid,
			courseId: courseId,
		});

		if (existingReview) {
			throw new Error('You have already reviewed this course');
		}

		const newTestimonial = await Testimonial.create({
			content: review,
			user: loginid,
			courseId,
			rating,
		});

		if (!newTestimonial) {
			throw new Error('Failed to create a testimonial');
		}

		// Update the course to include the testimonial id
		const updateCourse = await Course.findByIdAndUpdate(
			courseId,
			{ $push: { testimonials: newTestimonial._id } },
			{ new: true } // Return the updated course document
		);

		if (!updateCourse) {
			throw new Error('Failed to update the course testimonial');
		}
		return newTestimonial;
	} catch (error) {
		throw new Error(error);
	}
}