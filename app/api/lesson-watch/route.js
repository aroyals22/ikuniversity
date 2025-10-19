import { getLoggedInUser } from '@/lib/loggedin-user';
import { getLesson } from '@/queries/lessons';
import { getModuleBySlug } from '@/queries/modules';
import { NextRequest, NextResponse } from 'next/server';
import { Watch } from '@/model/watch-model';
import { createWatchReport } from '@/queries/reports';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/service/mongo';

const STARTED = 'started';
const COMPLETED = 'completed';

async function updateReport(userId, courseId, moduleId, lessonId) {
	try {
		await createWatchReport({ userId, courseId, moduleId, lessonId });
	} catch (error) {
		throw error; // Don't wrap in Error
	}
}

export async function POST(request) {
	await dbConnect();
	const { courseId, lessonId, moduleSlug, state, lastTime } =
		await request.json();

	const loggedinUser = await getLoggedInUser();
	const lesson = await getLesson(lessonId);
	const module = await getModuleBySlug(moduleSlug);

	if (!loggedinUser) {
		return new NextResponse(`You are not authenticated.`, {
			status: 401,
		});
	}

	if (state !== STARTED && state !== COMPLETED) {
		return new NextResponse(`Invalid state. Can not process request`, {
			status: 500,
		});
	}

	if (!lesson) {
		return new NextResponse(`Invalid lesson. Can not process request`, {
			status: 500,
		});
	}

	const watchEntry = {
		lastTime,
		lesson: lesson.id,
		module: module.id,
		user: loggedinUser.id,
		state,
	};

	try {
		const found = await Watch.findOne({
			lesson: lessonId,
			module: module.id,
			user: loggedinUser.id,
		}).lean();

		if (state === STARTED) {
			if (!found) {
				watchEntry['created_at'] = Date.now();
				await Watch.create(watchEntry);
			}
		} else if (state === COMPLETED) {
			if (!found) {
				watchEntry['created_at'] = Date.now();
				await Watch.create(watchEntry);
				await updateReport(loggedinUser.id, courseId, module.id, lessonId);
			} else {
				if (found.state === STARTED) {
					watchEntry['modified_at'] = Date.now();
					await Watch.findByIdAndUpdate(found._id, {
						state: COMPLETED,
					});
					await updateReport(loggedinUser.id, courseId, module.id, lessonId);
				}
			}
		}

		// ✅ FIXED: Revalidate the entire course layout (includes sidebar!)
		revalidatePath(`/courses/${courseId}`, 'layout');

		// Also revalidate account page
		revalidatePath('/account/enrolled-courses');

		return new NextResponse('Watch Record added Successfully', {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new NextResponse(error.message, {
			status: 500,
		});
	}
}