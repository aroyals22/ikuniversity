import { dbConnect } from '@/service/mongo';
import { Certificate } from '@/model/certificate-model';

export async function POST(request) {
	await dbConnect();

	try {
		const { user_id, course_id, enrollment_id } = await request.json();

		console.log('Test certificate creation with:', {
			user_id,
			course_id,
			enrollment_id,
		});

		const result = await Certificate.create({
			user_id,
			course_id,
			enrollment_id,
		});

		console.log('Certificate created:', result);

		return new Response(
			JSON.stringify({
				success: true,
				certificate: result,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.log('Certificate creation failed:', error);
		return new Response(
			JSON.stringify({
				error: error.message,
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
