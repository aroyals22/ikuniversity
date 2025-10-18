import mongoose, { Schema } from 'mongoose';

const assessmentSchema = new Schema(
	{
		assessments: {
			required: true,
			type: Array,
		},
		totalQuestions: {
			type: Number,
			default: 0,
		},
		correctAnswers: {
			type: Number,
			default: 0,
		},
		totalMarks: {
			type: Number,
			default: 0,
		},
		earnedMarks: {
			type: Number,
			default: 0,
		},
		score: {
			type: Number,
			default: 0,
		},
		passed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export const Assessment =
	mongoose.models.Assessment ?? mongoose.model('Assessment', assessmentSchema);