import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './model/user-model';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

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

					const isMatch = bcrypt.compareSync(
						credentials.password,
						user.password
					);

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