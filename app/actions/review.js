'use server';

import { Course } from '@/model/course-model';
import { Testimonial } from '@/model/testimonial-model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';

export async function createReview(data, loginid, courseId) {
	await dbConnect(); // ← MOVE BEFORE TRY

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
			{ new: true }
		);

		if (!updateCourse) {
			throw new Error('Failed to update the course testimonial');
		}

		// Revalidate the course pages to show updated reviews
		revalidatePath(`/courses/${courseId}`);
		revalidatePath(`/courses/${courseId}/lesson`);

		// Return plain object instead of Mongoose document
		return JSON.parse(JSON.stringify(newTestimonial));
	} catch (error) {
		throw new Error(error.message);
	}
}