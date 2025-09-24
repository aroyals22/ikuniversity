import mongoose from 'mongoose';

//Making connection with our MongoDB database named lms
export async function dbConnect() {
	try {
		const conn = await mongoose.connect(
			String(process.env.MONGODB_CONNECTION_STRING)
		);
		return conn;
	} catch (error) {
		// console.log(error);
	}
}
