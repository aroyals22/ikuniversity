import { dbConnect } from '@/service/mongo';
import { User } from '@/model/user-model';
import { PasswordReset } from '@/model/password-reset-model';
import { sendEmails } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
	await dbConnect();

	try {
		const { email } = await request.json();

		if (!email) {
			return new Response('Email is required', { status: 400 });
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			// Return success message even if user doesn't exist (security practice)
			return new Response('If an account exists, a reset email has been sent', {
				status: 200,
			});
		}

		// Generate secure token
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 3600000); // 1 hour from now

		// Clean up any existing reset tokens for this email
		await PasswordReset.deleteMany({ email });

		// Save new reset token
		await PasswordReset.create({
			email,
			token,
			expires,
		});

		// Send reset email using your existing utility
		const emailInfo = [
			{
				to: email,
				subject: 'Reset Your Password - IKU Training',
				message: `
				<h2>Password Reset Request</h2>
				<p>You requested to reset your password for IKU Training.</p>
				<p>Click the link below to reset your password:</p>
				<a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}" 
				   style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
				   Reset Password
				</a>
				<p>This link will expire in 1 hour.</p>
				<p>If you didn't request this, please ignore this email.</p>
			`,
			},
		];

		await sendEmails(emailInfo);

		return new Response('Reset email sent', { status: 200 });
	} catch (error) {
		console.error('Forgot password error:', error);
		return new Response('Failed to send reset email', { status: 500 });
	}
}
