import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema(
	{
		totalCompletedLessons: {
			required: true,
			type: Array,
		},
		totalCompletedModules: {
			// ✅ Fixed spelling!
			required: true,
			type: Array,
		},
		course: {
			type: Schema.ObjectId,
			ref: 'Course',
		},
		student: {
			type: Schema.ObjectId,
			ref: 'User',
		},
		quizAssessment: {
			type: Schema.ObjectId,
			ref: 'Assessment',
		},
		quizScore: {
			type: Number,
			default: 0, // Quiz score (0-100)
		},
		quizPassed: {
			type: Boolean,
			default: false, // Did student pass quiz?
		},
		quizTakenAt: {
			type: Date, // When quiz was taken
		},
		completion_date: {
			required: false,
			type: Date,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt
	}
);

export const Report = mongoose.models.Report ?? mongoose.model('Report', reportSchema);