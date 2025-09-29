// queries/reports.js
import { dbConnect } from '@/service/mongo';
import { replaceMongoIdInObject } from '@/lib/convertData';
import { Assessment } from '@/model/assessment-model';
import { Report } from '@/model/report-model';

export async function getReport(filter) {
	await dbConnect();

	try {
		// Prevent useless queries
		if (!filter || Object.values(filter).every((v) => !v)) {
			return null;
		}

		const report = await Report.findOne(filter)
			.populate({ path: 'quizAssessment', model: Assessment })
			.lean();

		// If no matching report, return null instead of throwing
		if (!report) {
			return null;
		}

		return replaceMongoIdInObject(report);
	} catch (err) {
		console.error('Error in getReport:', err);
		throw new Error('Failed to fetch report');
	}
}
