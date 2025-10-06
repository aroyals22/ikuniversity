import { dbConnect } from '@/service/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/auth';
import { User } from '@/model/user-model';

export const POST = async (request) => {
	const { firstName, lastName, email, password, userRole } =
		await request.json();

	await dbConnect();
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
		return new NextResponse(error.message, {
			status: 500,
		});
	}
};