// model/password-reset-model.js
import mongoose, { Schema } from 'mongoose';

const passwordResetSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
			unique: true,
		},
		expires: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Index for automatic cleanup of expired tokens
passwordResetSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset =
	mongoose.models.PasswordReset ??
	mongoose.model('PasswordReset', passwordResetSchema);
