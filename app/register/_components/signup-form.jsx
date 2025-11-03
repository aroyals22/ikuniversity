'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupForm({ role }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const formData = new FormData(event.currentTarget);
			const firstName = formData.get('first-name');
			const lastName = formData.get('last-name');
			const email = formData.get('email');
			const password = formData.get('password');
			const confirmPassword = formData.get('confirmPassword');

			// Validate passwords match
			if (password !== confirmPassword) {
				toast.error('Passwords do not match');
				setIsLoading(false);
				return;
			}

			// 8 character requirement
			if (password.length < 8) {
				toast.error('Password must be at least 8 characters');
				setIsLoading(false);
				return;
			}

			const commonPasswords = [
				'password',
				'12345678',
				'password123',
				'admin',
				'ikonix',
			];
			if (commonPasswords.includes(password.toLowerCase())) {
				toast.error('Please choose a stronger password');
				setIsLoading(false);
				return;
			}

			const userRole =
				role === 'student' || role === 'instructor' ? role : 'student';

			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password,
					userRole,
				}),
			});

			if (response.status === 201) {
				// Show success toast
				toast.success('Account created successfully!', {
					description: 'Redirecting to login...',
					duration: 2000,
				});

				// Redirect after toast shows
				setTimeout(() => {
					router.push('/login');
				}, 2000);
			} else {
				// Handle errors (409 for duplicate email, 500 for server error)
				const errorMessage = await response.text();
				toast.error('Registration failed', {
					description: errorMessage,
				});
			}
		} catch (e) {
			console.log(e.message);
			toast.error('Something went wrong', {
				description: 'Please try again later.',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='mx-auto max-w-sm w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg shadow-xl p-8 border border-white/10'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-white mb-2'>Sign Up</h1>
				<p className='text-gray-300 text-sm'>
					Enter your information to create an account
				</p>
			</div>

			<form onSubmit={onSubmit}>
				<div className='grid gap-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='grid gap-2'>
							<Label
								htmlFor='first-name'
								className='text-white text-sm font-medium'
							>
								First name
							</Label>
							<Input
								id='first-name'
								name='first-name'
								placeholder='Max'
								required
								disabled={isLoading}
								className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='grid gap-2'>
							<Label
								htmlFor='last-name'
								className='text-white text-sm font-medium'
							>
								Last name
							</Label>
							<Input
								id='last-name'
								name='last-name'
								placeholder='Robinson'
								required
								disabled={isLoading}
								className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
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
							disabled={isLoading}
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
							disabled={isLoading}
							className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						<p className='text-xs text-gray-400'>
							Must be at least 8 characters and not a common password
						</p>
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='confirmPassword'
							className='text-white text-sm font-medium'
						>
							Confirm Password
						</Label>
						<Input
							id='confirmPassword'
							name='confirmPassword'
							type='password'
							required
							disabled={isLoading}
							className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<Button
						type='submit'
						className='w-full bg-black text-white hover:bg-gray-900 py-3'
						disabled={isLoading}
					>
						{isLoading ? 'Creating account...' : 'Create an account'}
					</Button>
				</div>
				<div className='mt-4 text-center text-sm text-gray-300'>
					Already have an account?{' '}
					<Link
						href='/login'
						className='text-blue-400 hover:text-blue-300 underline'
					>
						Sign in
					</Link>
				</div>
			</form>
		</div>
	);
}