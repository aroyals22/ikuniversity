'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export function EnrollmentForm({ courses }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [selectedCourses, setSelectedCourses] = useState([]);
	const [sendNotification, setSendNotification] = useState(true);

	const handleCourseToggle = (courseId) => {
		setSelectedCourses((prev) =>
			prev.includes(courseId)
				? prev.filter((id) => id !== courseId)
				: [...prev, courseId]
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			toast.error('Please enter an email address');
			return;
		}

		if (selectedCourses.length === 0) {
			toast.error('Please select at least one course');
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/admin/enroll', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					courseIds: selectedCourses,
					sendNotification,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || 'Enrollment failed');
				return;
			}

			toast.success(data.message || 'User enrolled successfully!');

			// Reset form
			setEmail('');
			setSelectedCourses([]);
			setSendNotification(true);

			router.refresh();
		} catch (error) {
			console.error('Enrollment error:', error);
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Enroll User</CardTitle>
				<CardDescription>
					Enter the user's email and select courses to enroll them in
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Email Input */}
					<div className='space-y-2'>
						<Label htmlFor='email'>Student Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='student@example.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							required
						/>
						<p className='text-sm text-gray-500'>
							User must have an existing account
						</p>
					</div>

					{/* Course Selection */}
					<div className='space-y-2'>
						<Label>Select Courses</Label>
						<div className='border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto'>
							{courses.map((course) => (
								<div key={course.id} className='flex items-start space-x-3'>
									<Checkbox
										id={course.id}
										checked={selectedCourses.includes(course.id)}
										onCheckedChange={() => handleCourseToggle(course.id)}
										disabled={isLoading}
									/>
									<label
										htmlFor={course.id}
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
									>
										{course.title}
									</label>
								</div>
							))}
						</div>
					</div>

					{/* Send Notification */}
					<div className='flex items-center space-x-2'>
						<Checkbox
							id='sendNotification'
							checked={sendNotification}
							onCheckedChange={setSendNotification}
							disabled={isLoading}
						/>
						<label
							htmlFor='sendNotification'
							className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
						>
							Send enrollment notification email
						</label>
					</div>

					{/* Submit Button */}
					<Button type='submit' disabled={isLoading} className='w-full'>
						{isLoading ? 'Enrolling...' : 'Enroll User'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
