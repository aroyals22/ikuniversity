import { dbConnect } from '@/service/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/auth';
import { User } from '@/model/user-model';

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