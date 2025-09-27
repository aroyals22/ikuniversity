import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
if (!MONGODB_URI) {
	throw new Error('Please define MONGODB_CONNECTION_STRING in your .env.local');
}

// Keep connection cached across hot reloads (important for Next.js in dev)
let cached = global._mongoose;
if (!cached) {
	cached = global._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				bufferCommands: false,
				maxPoolSize: 5, // limit concurrent connections
				serverSelectionTimeoutMS: 10000, // fail fast after 10s
			})
			.then((mongooseInstance) => {
				return mongooseInstance;
			})
			.catch((err) => {
				cached.promise = null; // reset so we can retry later
				throw err;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (err) {
		throw err;
	}

	return cached.conn;
}
