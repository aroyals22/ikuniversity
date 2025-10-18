'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export const DownloadCertificate = ({
	courseId,
	totalProgress,
	quizPassed,
}) => {
	const [isCertificateDownloading, setIsCertificateDownloading] =
		useState(false);

	const canDownload = totalProgress === 100 && quizPassed;

	async function handleCertificateDownload() {
		if (!canDownload) {
			if (totalProgress < 100) {
				toast.error('Please complete all modules first');
			} else if (!quizPassed) {
				toast.error(
					'Please pass the quiz (70% or higher) to download certificate'
				);
			}
			return;
		}

		try {
			setIsCertificateDownloading(true);
			const response = await fetch(`/api/certificate?courseId=${courseId}`);

			if (!response.ok) {
				throw new Error('Failed to generate certificate');
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'Certificate.pdf';
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url); // Clean up

			toast.success('Congratulations! Certificate has been downloaded');
		} catch (error) {
			console.error('Error downloading certificate:', error);
			toast.error(error.message || 'Failed to download certificate');
		} finally {
			setIsCertificateDownloading(false);
		}
	}

	return (
		<div className='mt-6'>
			<Button
				disabled={!canDownload || isCertificateDownloading}
				onClick={handleCertificateDownload}
				className='w-full'
			>
				{isCertificateDownloading
					? 'Downloading...'
					: canDownload
						? 'Download Certificate'
						: totalProgress < 100
							? '🔒 Complete All Modules First'
							: '🔒 Pass Quiz First'}
			</Button>
			{!canDownload && (
				<p className='text-xs text-center text-muted-foreground mt-2'>
					{totalProgress < 100
						? `Complete ${Math.round(100 - totalProgress)}% more to unlock`
						: 'Pass the quiz (70%+) to unlock'}
				</p>
			)}
		</div>
	);
};