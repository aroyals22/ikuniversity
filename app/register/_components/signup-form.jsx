'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
		<Card className='mx-auto max-w-sm'>
			<CardHeader>
				<CardTitle className='text-xl'>
					<p className='mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj'>
						<span className='relative inline-flex sm:inline'>
							<span className='bg-gradient-to-r from-[#7d2f2f] via-[#b4b7f3] to-[#1e0b53] blur-lg filter opacity-30 w-full h-full absolute inset-0'></span>
							<span className='relative'>Sign Up</span>
						</span>
					</p>
				</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit}>
					<div className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='first-name'>First name</Label>
								<Input
									id='first-name'
									name='first-name'
									placeholder='Max'
									required
									disabled={isLoading}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='last-name'>Last name</Label>
								<Input
									id='last-name'
									name='last-name'
									placeholder='Robinson'
									required
									disabled={isLoading}
								/>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='m@example.com'
								required
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								required
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								required
								disabled={isLoading}
							/>
						</div>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? 'Creating account...' : 'Create an account'}
						</Button>
					</div>
					<div className='mt-4 text-center text-sm'>
						Already have an account?{' '}
						<Link href='/login' className='underline'>
							Sign in
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}