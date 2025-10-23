'use client';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/vimeo';

export const PreviewPlayer = ({ videoUrl }) => {
	const [hasWindow, setHasWindow] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true);
		}
	}, []);

	return (
		<>
			{hasWindow && (
				<ReactPlayer
					url={videoUrl}
					width='100%'
					height='470px'
					controls={true}
					onError={(e) => console.error('Player error:', e)}
				/>
			)}
		</>
	);
};
