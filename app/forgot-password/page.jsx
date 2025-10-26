'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AuthHeader } from '@/components/auth-header';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch('/api/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setEmailSent(true);
				toast.success('Reset email sent! Check your inbox.');
			} else {
				toast.error('Failed to send reset email. Please try again.');
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<AuthHeader />
			<div className='w-full flex-col h-[calc(100vh-80px)] flex items-center justify-center'>
				<Card className='mx-auto max-w-sm'>
					<CardHeader>
						<CardTitle className='text-xl'>Forgot Password</CardTitle>
						<CardDescription>
							Enter your email address and we'll send you a link to reset your
							password
						</CardDescription>
					</CardHeader>
					<CardContent>
						{emailSent ? (
							<div className='text-center space-y-4'>
								<p className='text-green-600'>
									If an account exists with that email, we've sent reset
									instructions.
								</p>
								<Link href='/login' className='text-blue-600 hover:underline'>
									Return to login
								</Link>
							</div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder='Enter your email address'
										required
										disabled={isLoading}
									/>
								</div>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Sending...' : 'Send Reset Link'}
								</Button>
								<div className='text-center'>
									<Link
										href='/login'
										className='text-sm text-blue-600 hover:underline'
									>
										Back to login
									</Link>
								</div>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
