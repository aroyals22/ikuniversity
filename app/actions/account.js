'use server';

import { User } from '@/model/user-model';
import { hashPassword } from '@/auth';
import { revalidatePath } from 'next/cache';
import { validatePassword } from '@/queries/users';
import { dbConnect } from '@/service/mongo'; // ← ADD THIS IMPORT

export async function updateUserInfo(email, updatedData) {
	await dbConnect(); // ← ADD THIS
	try {
		const filter = { email: email };
		await User.findOneAndUpdate(filter, updatedData);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}

export async function changePassword(email, oldPassword, newPassword) {
	await dbConnect(); // ← ADD THIS (before the validatePassword call)

	const isMatch = await validatePassword(email, oldPassword);

	if (!isMatch) {
		throw new Error('Please enter a valid current password');
	}

	const filter = { email: email };
	const hashedPassword = hashPassword(newPassword);

	const dataToUpdate = {
		// ← Fixed typo: "dataToUpadate" → "dataToUpdate"
		password: hashedPassword,
	};

	try {
		await User.findOneAndUpdate(filter, dataToUpdate);
		revalidatePath('/account');
	} catch (error) {
		throw new Error(error);
	}
}