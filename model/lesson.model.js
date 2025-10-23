import mongoose, { Schema } from 'mongoose';

// Slide subdocument schema
const slideSchema = new Schema({
	image_url: {
		required: true,
		type: String,
	},
	text_content: {
		required: true,
		type: String,
	},
	order: {
		required: true,
		type: Number,
	},
}, { _id: false }); // No separate IDs for slides

const lessonSchema = new Schema({
	title: {
		required: true,
		type: String,
	},
	description: {
		required: false,
		type: String,
	},

	// Lesson type: video or slides
	type: {
		required: true,
		type: String,
		enum: ['video', 'slides'],
		default: 'video',
	},

	// VIDEO LESSON FIELDS
	duration: {
		required: false, // Not required since slides don't have duration
		default: 0,
		type: Number,
	},
	video_url: {
		required: false,
		type: String,
	},

	// SLIDES LESSON FIELDS
	slides: {
		required: false,
		type: [slideSchema],
		validate: {
			validator: function (slides) {
				return slides.length <= 10; // Max 10 slides
			},
			message: 'A lesson can have a maximum of 10 slides',
		},
	},

	// COMMON FIELDS
	active: {
		required: true,
		default: false,
		type: Boolean,
	},
	slug: {
		required: true,
		type: String,
	},
	access: {
		required: true,
		default: 'private',
		type: String,
	},
	order: {
		required: true,
		type: Number,
	},
});

export const Lesson = mongoose.models.Lesson ?? mongoose.model('Lesson', lessonSchema);