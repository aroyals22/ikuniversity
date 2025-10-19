import { dbConnect } from '@/service/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/auth';
import { User } from '@/model/user-model';

export const POST = async (request) => {
	await dbConnect();
	const { firstName, lastName, email, password, userRole } =
		await request.json();

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
