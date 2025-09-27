import { replaceMongoIdInArray } from '@/lib/convertData';
import { Category } from '@/model/category-model';
import { dbConnect } from '@/service/mongo';

export async function getCategories() {
	await dbConnect();
	const categories = await Category.find({}).lean();
	return replaceMongoIdInArray(categories);
}
