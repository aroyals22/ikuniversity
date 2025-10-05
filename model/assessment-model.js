import mongoose, { Schema } from 'mongoose';

const assessmentSchema = new Schema({
	assessments: {
		required: false,
		type: Array,
	},
	otherMarks: {
		required: false,
		type: Number,
	},
});
export const Assessment =
	mongoose.models.Assessment ?? mongoose.model('Assessment', assessmentSchema);
