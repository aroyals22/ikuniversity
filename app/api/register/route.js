import { dbConnect } from '@/service/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/auth';
import { User } from '@/model/user-model';
import { sendEmails } from '@/lib/emails';
import React from 'react';

export const POST = async (request) => {
	await dbConnect();
	const { firstName, lastName, email, password, userRole } =
		await request.json();

	// Password validation
	if (password.length < 8) {
		return new NextResponse('Password must be at least 8 characters', {
			status: 400,
		});
	}

	if (password.length > 128) {
		return new NextResponse('Password cannot exceed 128 characters', {
			status: 400,
		});
	}

	// Check against common weak passwords
	const commonPasswords = [
		'password',
		'12345678',
		'password123',
		'admin',
		'ikonix',
	];
	if (commonPasswords.includes(password.toLowerCase())) {
		return new NextResponse('Please choose a stronger password', {
			status: 400,
		});
	}

	const hashedPassword = hashPassword(password);

	const newUser = {
		firstName,
		lastName,
		email,
		password: hashedPassword,
		role: userRole,
	};

	try {
		await User.create(newUser);

		// Send welcome email
		try {
			const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
			const emailInfo = [
				{
					to: email,
					subject: 'Welcome to IKU Training!',
					message: React.createElement(
						'div',
						null,
						React.createElement(
							'h2',
							null,
							`Welcome to IKU Training, ${firstName}!`
						),
						React.createElement(
							'p',
							null,
							`Thank you for registering as a ${userRole} with IKU Training.`
						),
						React.createElement(
							'p',
							null,
							'Your account has been successfully created and you can now access our training platform.'
						),
						React.createElement(
							'p',
							null,
							'Click the link below to log in and start your training journey:'
						),
						React.createElement(
							'a',
							{
								href: loginLink,
								style: {
									background: '#0066cc',
									color: 'white',
									padding: '10px 20px',
									textDecoration: 'none',
									borderRadius: '5px',
									display: 'inline-block',
									margin: '10px 0',
								},
							},
							'Login to Your Account'
						),
						React.createElement(
							'p',
							null,
							'If you have any questions, feel free to contact our support team.'
						),
						React.createElement('p', null, 'Welcome aboard!')
					),
				},
			];

			await sendEmails(emailInfo);
		} catch (emailError) {
			console.error('Failed to send welcome email:', emailError);
			// Don't fail registration if email fails
		}

		return new NextResponse('User has been created', {
			status: 201,
		});
	} catch (error) {
		console.log(error);

		// Check for MongoDB duplicate key error
		if (error.code === 11000) {
			return new NextResponse('This email is already registered', {
				status: 409, // 409 Conflict
			});
		}

		// Generic error for other issues
		return new NextResponse('Registration failed. Please try again.', {
			status: 500,
		});
	}
};