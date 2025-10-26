import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

import { getCourseDetails } from '@/queries/courses';
import { getLoggedInUser } from '@/lib/loggedin-user';
import { getReport } from '@/queries/reports';
import { formatMyDate } from '@/lib/date';
import { dbConnect } from '@/service/mongo';
import { Certificate } from '@/model/certificate-model';

export async function GET(request) {
	await dbConnect();
	try {
		// Load fonts inside the function
		const kalamFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/kalam/Kalam-Regular.ttf`;
		const kalamFontBytes = await fetch(kalamFontUrl).then((res) => {
			if (!res.ok) throw new Error(`Failed to load Kalam font: ${res.status}`);
			return res.arrayBuffer();
		});

		const montserratItalicFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Italic.ttf`;
		const montserratItalicFontBytes = await fetch(montserratItalicFontUrl).then(
			(res) => {
				if (!res.ok)
					throw new Error(
						`Failed to load Montserrat Italic font: ${res.status}`
					);
				return res.arrayBuffer();
			}
		);

		const montserratFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Medium.ttf`;
		const montserratFontBytes = await fetch(montserratFontUrl).then((res) => {
			if (!res.ok)
				throw new Error(`Failed to load Montserrat font: ${res.status}`);
			return res.arrayBuffer();
		});

		/* -----------------
		 * Configurations
		 *-------------------*/
		const searchParams = request.nextUrl.searchParams;
		const courseId = searchParams.get('courseId');
		const course = await getCourseDetails(courseId);
		const loggedInUser = await getLoggedInUser();

		const report = await getReport({
			course: courseId,
			student: loggedInUser.id,
		});

		// Save certificate record to database
		try {
			// Generate certificate link
			const certificateLink = `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/${loggedInUser.id}_${courseId}_certificate.pdf`;

			// Check if certificate already exists to avoid duplicates
			const existingCert = await Certificate.findOne({
				user_id: loggedInUser.id,
				course_id: courseId,
			});

			if (!existingCert) {
				await Certificate.create({
					user_id: loggedInUser.id,
					course_id: courseId,
					enrollment_id: report?.enrollment?.toString() || '',
					certificate_link: certificateLink,
				});
				console.log('Certificate record saved successfully');
			} else {
				console.log('Certificate record already exists');
			}
		} catch (certError) {
			console.log('Certificate record creation failed:', certError);
			// Continue with PDF generation even if DB save fails
		}

		const completionDate = report?.completion_date
			? formatMyDate(report?.completion_date)
			: formatMyDate(new Date());

		const completionInfo = {
			name: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
			completionDate: completionDate,
			courseName: course.title,
			instructor: `${course?.instructor?.firstName} ${course?.instructor?.lastName}`,
			instructorDesignation: `${course?.instructor?.designation}`,
			sign: '/sign.png',
		};

		const pdfDoc = await PDFDocument.create();
		pdfDoc.registerFontkit(fontkit);

		const kalamFont = await pdfDoc.embedFont(kalamFontBytes);
		const montserratItalic = await pdfDoc.embedFont(montserratItalicFontBytes);
		const montserrat = await pdfDoc.embedFont(montserratFontBytes);

		const page = pdfDoc.addPage([841.89, 595.28]);
		const { width, height } = page.getSize();
		const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

		/* -----------------
		 * Logo
		 *-------------------*/
		const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/ikutraininglogo.png`;
		const logoBytes = await fetch(logoUrl).then((res) => {
			if (!res.ok) throw new Error(`Failed to load logo: ${res.status}`);
			return res.arrayBuffer();
		});

		const logo = await pdfDoc.embedPng(logoBytes);
		const logoDimns = logo.scale(0.15);

		page.drawImage(logo, {
			x: width / 2 - logoDimns.width / 2,
			y: height - 220,
			width: logoDimns.width,
			height: logoDimns.height,
		});

		/* -----------------
		 * Title
		 *-------------------*/
		const titleFontSize = 30;
		const titleText = 'Certificate Of Completion';
		const titleTextWidth = montserrat.widthOfTextAtSize(
			titleText,
			titleFontSize
		);

		page.drawText('Certificate Of Completion', {
			x: width / 2 - titleTextWidth / 2,
			y: 370,
			size: titleFontSize,
			font: montserrat,
			color: rgb(0, 0.53, 0.71),
		});

		/* -----------------
		 * Name Label
		 *-------------------*/
		const nameLabelText = 'This certificate is hereby bestowed upon';
		const nameLabelFontSize = 20;
		const nameLabelTextWidth = montserratItalic.widthOfTextAtSize(
			nameLabelText,
			nameLabelFontSize
		);

		page.drawText(nameLabelText, {
			x: width / 2 - nameLabelTextWidth / 2,
			y: 330,
			size: nameLabelFontSize,
			font: montserratItalic,
			color: rgb(0, 0, 0),
		});

		/* -----------------
		 * Name
		 *-------------------*/
		const nameText = completionInfo.name;
		const nameFontSize = 40;
		const nameTextWidth = timesRomanFont.widthOfTextAtSize(
			nameText,
			nameFontSize
		);

		page.drawText(nameText, {
			x: width / 2 - nameTextWidth / 2,
			y: 270,
			size: nameFontSize,
			font: kalamFont,
			color: rgb(0, 0, 0),
		});

		/* -----------------
		 * Details Info
		 *-------------------*/
		const detailsText = `This is to certify that ${completionInfo.name} successfully completed the ${completionInfo.courseName} course on ${completionInfo.completionDate} by ${completionInfo.instructor}`;
		const detailsFontSize = 16;

		page.drawText(detailsText, {
			x: width / 2 - 700 / 2,
			y: 210,
			size: detailsFontSize,
			font: montserrat,
			color: rgb(0, 0, 0),
			maxWidth: 700,
			wordBreaks: [' '],
		});

		/* -----------------
		 * Signatures
		 *-------------------*/
		const signatureBoxWidth = 300;
		page.drawText(completionInfo.instructor, {
			x: width - signatureBoxWidth,
			y: 90,
			size: detailsFontSize,
			font: timesRomanFont,
			color: rgb(0, 0, 0),
		});
		page.drawText(completionInfo.instructorDesignation, {
			x: width - signatureBoxWidth,
			y: 72,
			size: 10,
			font: timesRomanFont,
			color: rgb(0, 0, 0),
			maxWidth: 250,
		});
		page.drawLine({
			start: { x: width - signatureBoxWidth, y: 110 },
			end: { x: width - 60, y: 110 },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		const signUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${completionInfo.sign}`;
		const signBytes = await fetch(signUrl).then((res) => {
			if (!res.ok) throw new Error(`Failed to load signature: ${res.status}`);
			return res.arrayBuffer();
		});
		const sign = await pdfDoc.embedPng(signBytes);

		page.drawImage(sign, {
			x: width - signatureBoxWidth,
			y: 120,
			width: 180,
			height: 54,
		});

		/* -----------------
		 * Pattern background
		 *-------------------*/
		const patternUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pattern.jpg`;
		const patternBytes = await fetch(patternUrl).then((res) => {
			if (!res.ok) throw new Error(`Failed to load pattern: ${res.status}`);
			return res.arrayBuffer();
		});
		const pattern = await pdfDoc.embedJpg(patternBytes);

		page.drawImage(pattern, {
			x: 0,
			y: 0,
			width: width,
			height: height,
			opacity: 0.2,
		});

		/* -----------------
		 * Generate and send Response
		 *-------------------*/
		const pdfBytes = await pdfDoc.save();
		return new Response(pdfBytes, {
			headers: {
				'content-type': 'application/pdf',
				'content-disposition': 'attachment; filename="certificate.pdf"',
			},
		});
	} catch (error) {
		console.error('PDF generation error:', error);
		console.error('Error stack:', error.stack);
		return new Response(
			JSON.stringify({
				error: 'Failed to generate certificate',
				details: error.message,
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' },
			}
		);
	}
}