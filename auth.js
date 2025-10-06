import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './model/user-model';
import crypto from 'crypto';
import { authConfig } from './auth.config';
import { dbConnect } from './service/mongo';

// Helper function to hash passwords
function hashPassword(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			async authorize(credentials) {
				if (credentials == null) return null;

				console.log('[AUTH] Starting auth');

				try {
					// Connect to database first
					await dbConnect();
					console.log('[AUTH] DB connected');

					const user = await User.findOne({ email: credentials?.email });

					if (!user) {
						console.log('[AUTH] User not found');
						return null;
					}

					console.log('[AUTH] User found');

					// Hash the input password
					const hashedInput = hashPassword(credentials.password);

					// Compare hashed passwords
					const isMatch = hashedInput === user.password;
					console.log('[AUTH] Match result:', isMatch);

					if (isMatch) {
						return {
							id: user._id.toString(),
							email: user.email,
							name: user.firstName + ' ' + user.lastName,
							role: user.role,
						};
					}

					return null;
				} catch (err) {
					console.error('[AUTH] Error:', err.message);
					return null;
				}
			},
		}),
	],
});

// Export the hash function so other files can use it
export { hashPassword };