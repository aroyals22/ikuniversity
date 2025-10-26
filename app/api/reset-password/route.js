import { dbConnect } from '@/service/mongo';
import { User } from '@/model/user-model';
import { PasswordReset } from '@/model/password-reset-model';
import { hashPassword } from '@/auth';

export async function POST(request) {
	await dbConnect();

	try {
		const { token, password } = await request.json();

		if (!token || !password) {
			return new Response('Token and password are required', { status: 400 });
		}

		// Password validation (same as your registration)
		if (password.length < 8) {
			return new Response('Password must be at least 8 characters', {
				status: 400,
			});
		}

		if (password.length > 128) {
			return new Response('Password cannot exceed 128 characters', {
				status: 400,
			});
		}

		const commonPasswords = [
			'password',
			'12345678',
			'password123',
			'admin',
			'ikonix',
		];
		if (commonPasswords.includes(password.toLowerCase())) {
			return new Response('Please choose a stronger password', { status: 400 });
		}

		// Find and validate the reset token
		const resetRecord = await PasswordReset.findOne({
			token,
			expires: { $gt: new Date() }, // Token must not be expired
		});

		if (!resetRecord) {
			return new Response('Invalid or expired reset token', { status: 400 });
		}

		// Find the user
		const user = await User.findOne({ email: resetRecord.email });
		if (!user) {
			return new Response('User not found', { status: 400 });
		}

		// Hash the new password
		const hashedPassword = hashPassword(password);

		// Update the user's password
		await User.findByIdAndUpdate(user._id, {
			password: hashedPassword,
		});

		// Delete the used reset token
		await PasswordReset.deleteOne({ _id: resetRecord._id });

		return new Response('Password reset successfully', { status: 200 });
	} catch (error) {
		console.error('Reset password error:', error);
		return new Response('Failed to reset password', { status: 500 });
	}
}
