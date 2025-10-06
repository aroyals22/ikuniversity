'use server';
import { signIn } from '@/auth';

export async function credentialLogin(formData) {
	try {
		const response = await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false,
		});
		return response;
	} catch (error) {
		return { error: error.message };
	}
}
