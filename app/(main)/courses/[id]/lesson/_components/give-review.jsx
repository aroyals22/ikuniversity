'use client';
import { Button } from '@/components/ui/button';
import { ReviewModal } from './review-modal';
import { useState } from 'react';

export const GiveReview = ({ courseId, loginid, hasReviewed }) => {
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsReviewModalOpen(true)}
				variant='outline'
				className='w-full mt-6'
				disabled={hasReviewed}
			>
				{hasReviewed ? 'Already Reviewed' : 'Give Review'}
			</Button>
			{!hasReviewed && (
				<ReviewModal
					open={isReviewModalOpen}
					setOpen={setIsReviewModalOpen}
					courseId={courseId}
					loginid={loginid}
				/>
			)}
		</>
	);
};