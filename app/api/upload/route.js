import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { updateCourse } from '@/app/actions/course';

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get('files');
		const courseId = formData.get('courseId');

		if (!file) {
			return new NextResponse('No file provided', { status: 400 });
		}

		// Upload to Vercel Blob with timestamp to avoid duplicates
		const timestamp = Date.now();
		const filename = `${timestamp}-${file.name}`;

		const blob = await put(filename, file, {
			access: 'public',
		});

		// blob.url is the permanent URL returned by Vercel
		// Example: https://abc123.public.blob.vercel-storage.com/1704067200-image.jpg

		// Update database with blob URL
		await updateCourse(courseId, { thumbnail: blob.url });

		return NextResponse.json(
			{
				message: 'File uploaded successfully',
				url: blob.url,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error('Upload error:', err);
		return new NextResponse(err.message, {
			status: 500,
		});
	}
}

// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import { pipeline } from 'stream';
// import { promisify } from 'util';
// import { updateCourse } from '@/app/actions/course';

// const pump = promisify(pipeline);

// export async function POST(request, response) {
// 	try {
// 		const formData = await request.formData();
// 		const file = formData.get('files');
// 		const destination = formData.get('destination');

// 		if (!destination) {
// 			return new NextResponse('Destination not provided', {
// 				status: 500,
// 			});
// 		}

// 		const filePath = `${destination}/${file.name}`;
// 		await pump(file.stream(), fs.createWriteStream(filePath));

// 		const courseId = formData.get('courseId');
// 		await updateCourse(courseId, { thumbnail: file.name });

// 		return new NextResponse(`File ${file.name} uploaded successfully  `, {
// 			status: 200,
// 		});
// 	} catch (err) {
// 		return new NextResponse(err.message, {
// 			status: 500,
// 		});
// 	}
// }
