import {
	replaceMongoIdInArray,
	replaceMongoIdInObject,
} from '@/lib/convertData';
import { Lesson } from '@/model/lesson.model';
import { dbConnect } from '@/service/mongo';

export async function getLesson(lessonId) {
	await dbConnect();
	const lesson = await Lesson.findById(lessonId).lean();
	return replaceMongoIdInObject(lesson);
}
