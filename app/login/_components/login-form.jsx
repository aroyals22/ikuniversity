'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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

			console.log('SignIn result:', result); // Add this

			if (result?.error) {
				console.log('Error:', result.error);
				const errorMessage = 'Invalid email or password';
				setError(errorMessage);
				toast.error(errorMessage);
			} else if (result?.ok) {
				// Change this line - check for ok explicitly
				toast.success('Login Successful!');
				window.location.href = '/courses'; // Force a full page redirect instead of router.push
			}
		} catch (e) {
			console.error('Exception:', e);
			setError(e.message);
			toast.error('Something went wrong');
		}
	}

	return (
		<Card className='mx-auto max-w-sm w-full'>
			<CardHeader>
				<CardTitle className='text-2xl'>
					<p className='mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj'>
						<span className='relative inline-flex sm:inline'>
							<span className='bg-gradient-to-r from-[#670c0c] via-[#cfd2ee] to-[#1d1744] blur-lg filter opacity-30 w-full h-full absolute inset-0'></span>
							<span className='relative'>Login</span>
						</span>
					</p>
				</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit}>
					<div className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='m@example.com'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<div className='flex items-center'>
								<Label htmlFor='password'>Password</Label>
							</div>
							<Input id='password' name='password' type='password' required />
							{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
						</div>
						<Button type='submit' className='w-full'>
							Login
						</Button>
					</div>

					<div className='flex items-center justify-between mt-4'>
						<Link
							href='/forgot-password'
							className='text-sm text-blue-600 hover:underline'
						>
							Forgot your password?
						</Link>
					</div>
					<div className='mt-4 text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link href='/register/instructor' className='underline'>
							Instructor
						</Link>{' '}
						or{' '}
						<Link href='/register/student' className='underline'>
							Student
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}