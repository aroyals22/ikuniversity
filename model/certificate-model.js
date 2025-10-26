import mongoose, { Schema } from 'mongoose';

const certificateSchema = new Schema(
	{
		user_id: {
			type: String,
			required: true,
		},
		course_id: {
			type: String,
			required: true,
		},
		enrollment_id: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Certificate =
	mongoose.models.Certificate ??
	mongoose.model('Certificate', certificateSchema);
