import mongoose, { Schema } from 'mongoose';

const quizzesSchema = new Schema({
	title: {
		required: true,
		type: String,
	},
	description: {
		type: String,
	},
	slug: {
		type: String,
	},
	explanations: {
		type: String,
	},
	options: {
		type: Array,
	},
});

export const Quiz = mongoose.models.Quiz ?? mongoose.model('Quiz', quizzesSchema);