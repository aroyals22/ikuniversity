import {
	replaceMongoIdInArray,
	replaceMongoIdInObject,
} from '@/lib/convertData';
import { User } from '@/model/user-model';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/service/mongo';

export async function getUserByEmail(email) {
	await dbConnect();
	const user = await User.findOne({ email: email }).lean();
	return replaceMongoIdInObject(user);
}

export async function validatePassword(email, password) {
	await dbConnect();
	const user = await getUserByEmail(email);
	const isMatch = await bcrypt.compare(password, user.password);
	return isMatch;
}