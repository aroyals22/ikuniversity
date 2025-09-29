'use server';

import { User } from '@/model/user-model';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { validatePassword } from '@/queries/users';

export async function updateUserInfo(email, updatedData) {
	try {
		const filter = { email: email };
		await User.findOneAndUpdate(filter, updatedData);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}

export async function changePassword(email, oldPassword, newPassword) {
	const isMatch = await validatePassword(email, oldPassword);

	if (!isMatch) {
		throw new Error('Please enter a valid current password');
	}
	const filter = { email: email };
	const hashedPassword = await bcrypt.hash(newPassword, 5);

	const dataToUpadate = {
		password: hashedPassword,
	};

	try {
		await User.findOneAndUpdate(filter, dataToUpadate);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}
