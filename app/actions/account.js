'use server';

import { User } from '@/model/user-model';
import { hashPassword } from '@/auth';
import { revalidatePath } from 'next/cache';
import { validatePassword } from '@/queries/users';
import { dbConnect } from '@/service/mongo';

export async function updateUserInfo(email, updatedData) {
	await dbConnect();
	try {
		const filter = { email: email };
		await User.findOneAndUpdate(filter, updatedData);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}

export async function changePassword(email, oldPassword, newPassword) {
	await dbConnect();

	// Password strength validation
	if (newPassword.length < 8) {
		throw new Error('Password must be at least 8 characters');
	}

	if (newPassword.length > 128) {
		throw new Error('Password cannot exceed 128 characters');
	}

	// Check against common weak passwords
	const commonPasswords = [
		'password',
		'12345678',
		'password123',
		'admin',
		'ikonix',
	];
	if (commonPasswords.includes(newPassword.toLowerCase())) {
		throw new Error('Please choose a stronger password');
	}

	const isMatch = await validatePassword(email, oldPassword);

	if (!isMatch) {
		throw new Error('Please enter a valid current password');
	}

	const filter = { email: email };
	const hashedPassword = hashPassword(newPassword);

	const dataToUpdate = {
		password: hashedPassword,
	};

	try {
		await User.findOneAndUpdate(filter, dataToUpdate);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}