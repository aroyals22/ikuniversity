'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function LoginForm() {
	const [error, setError] = useState('');
	const router = useRouter();

	async function onSubmit(event) {
		event.preventDefault();

		try {
			const formData = new FormData(event.currentTarget);

			const result = await signIn('credentials', {
				email: formData.get('email'),
				password: formData.get('password'),
				redirect: false,
			});

			console.log('SignIn result:', result);

			if (result?.error) {
				console.log('Error:', result.error);
				const errorMessage = 'Invalid email or password';
				setError(errorMessage);
				toast.error(errorMessage);
			} else if (result?.ok) {
				toast.success('Login Successful!');
				window.location.href = '/courses';
			}
		} catch (e) {
			console.error('Exception:', e);
			setError(e.message);
			toast.error('Something went wrong');
		}
	}

	return (
		<div className='mx-auto max-w-sm w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg shadow-xl p-8 border border-white/10'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-white mb-2'>Login</h1>
				<p className='text-gray-300 text-sm'>
					Enter your email below to login to your account
				</p>
			</div>

			<form onSubmit={onSubmit}>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email' className='text-white text-sm font-medium'>
							Email
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='m@example.com'
							required
							className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='password'
							className='text-white text-sm font-medium'
						>
							Password
						</Label>
						<Input
							id='password'
							name='password'
							type='password'
							required
							className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						{error && <p className='text-sm text-red-400 mt-1'>{error}</p>}
					</div>
					<Button
						type='submit'
						className='w-full bg-black text-white hover:bg-gray-900 py-3'
					>
						Login
					</Button>
				</div>

				<div className='flex items-center justify-center mt-4'>
					<Link
						href='/forgot-password'
						className='text-sm text-blue-400 hover:text-blue-300 hover:underline'
					>
						Forgot your password?
					</Link>
				</div>
				<div className='mt-4 text-center text-sm text-gray-300'>
					Don&apos;t have an account?{' '}
					<Link
						href='/register/instructor'
						className='text-blue-400 hover:text-blue-300 underline'
					>
						Instructor
					</Link>{' '}
					or{' '}
					<Link
						href='/register/student'
						className='text-blue-400 hover:text-blue-300 underline'
					>
						Student
					</Link>
				</div>
			</form>
		</div>
	);
}