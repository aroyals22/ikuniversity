import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './model/user-model';
import crypto from 'crypto';
import { authConfig } from './auth.config';

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

				try {
					const user = await User.findOne({ email: credentials?.email });

					if (!user) {
						return null;
					}

					// Hash the input password
					const hashedInput = hashPassword(credentials.password);

					// Compare hashed passwords
					const isMatch = hashedInput === user.password;

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
					console.error('Auth error:', err);
					return null;
				}
			},
		}),
	],
});

// Export the hash function so other files can use it
export { hashPassword };