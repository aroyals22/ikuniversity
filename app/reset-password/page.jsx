'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [tokenValid, setTokenValid] = useState(null);
	const [resetComplete, setResetComplete] = useState(false);

	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');

	useEffect(() => {
		if (!token) {
			setTokenValid(false);
		}
	}, [token]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, password }),
			});

			if (response.ok) {
				setResetComplete(true);
				toast.success('Password reset successfully!');
				setTimeout(() => {
					router.push('/login');
				}, 2000);
			} else {
				const error = await response.text();
				toast.error(error || 'Failed to reset password');
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (!token || tokenValid === false) {
		return (
			<>
				<AuthHeader />
				<div className='w-full flex-col h-[calc(100vh-80px)] flex items-center justify-center'>
					<Card className='mx-auto max-w-sm'>
						<CardHeader>
							<CardTitle className='text-xl'>Invalid Reset Link</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-red-600 mb-4'>
								This password reset link is invalid or has expired.
							</p>
							<Link
								href='/forgot-password'
								className='text-blue-600 hover:underline'
							>
								Request a new reset link
							</Link>
						</CardContent>
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			<AuthHeader />
			<div className='w-full flex-col h-[calc(100vh-80px)] flex items-center justify-center'>
				<Card className='mx-auto max-w-sm'>
					<CardHeader>
						<CardTitle className='text-xl'>Reset Password</CardTitle>
						<CardDescription>Enter your new password below</CardDescription>
					</CardHeader>
					<CardContent>
						{resetComplete ? (
							<div className='text-center space-y-4'>
								<p className='text-green-600'>
									Password reset successfully! Redirecting to login...
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='password'>New Password</Label>
									<Input
										id='password'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder='Enter new password (min 8 characters)'
										required
										disabled={isLoading}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>Confirm Password</Label>
									<Input
										id='confirmPassword'
										type='password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder='Confirm new password'
										required
										disabled={isLoading}
									/>
								</div>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Resetting...' : 'Reset Password'}
								</Button>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
