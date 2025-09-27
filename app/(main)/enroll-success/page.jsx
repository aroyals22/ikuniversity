import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { stripe } from '@/lib/stripe';
import { getCourseDetails } from '@/queries/courses';
import { getUserByEmail } from '@/queries/users';
import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Success({ searchParams }) {
	// ✅ await searchParams before using it
	const { session_id, courseId } = await searchParams;

	if (!session_id) {
		throw new Error('Please provide a valid session id that starts with cs_');
	}

	const userSession = await auth();
	if (!userSession?.user?.email) redirect('/login');

	const [course, loggedInUser] = await Promise.all([
		getCourseDetails(courseId),
		getUserByEmail(userSession.user.email),
	]);

	const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ['payment_intent', 'line_items'],
	});

	const isPaid = checkoutSession.payment_status === 'paid';
	const customerName =
		`${loggedInUser?.firstName ?? ''} ${loggedInUser?.lastName ?? ''}`.trim() ||
		loggedInUser?.email ||
		'Customer';
	const productName = course?.title ?? 'your course';

	return (
		<div className='h-full w-full flex-1 flex flex-col items-center justify-center'>
			<div className='flex flex-col items-center gap-6 max-w-[600px] text-center'>
				{isPaid && (
					<>
						<CircleCheck className='w-32 h-32 text-green-600' />
						<h1 className='text-xl md:text-2xl lg:text-3xl'>
							Congratulations, <strong>{customerName}</strong>! You’re now
							enrolled in <strong>{productName}</strong>.
						</h1>
					</>
				)}

				<div className='flex items-center gap-3'>
					<Button asChild size='sm'>
						<Link href='/courses'>Browse Courses</Link>
					</Button>
					<Button asChild variant='outline' size='sm'>
						<Link href={courseId ? `/courses/${courseId}` : '/courses'}>
							Play Course
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
