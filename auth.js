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
				await dbConnect();
				try {
					console.log('[AUTH] DB connected');

					const user = await User.findOne({ email: credentials?.email });

					if (!user) {
						console.log('[AUTH] User not found');
						throw new Error('Invalid email or password');
					}

					console.log('[AUTH] User found');

					const hashedInput = hashPassword(credentials.password);
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

					console.log('[AUTH] Password mismatch');
					throw new Error('Invalid email or password');
				} catch (err) {
					console.error('[AUTH] Error:', err.message);
					throw err;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// Add user data to token on sign in
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			// Add token data to session
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
});

export { hashPassword };