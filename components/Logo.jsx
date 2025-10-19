import Image from 'next/image';
import React from 'react';
import ikonix from '@/public/assets/images/Ikonix-Logo.png';
import { cn } from '@/lib/utils';

const Logo = ({ className = '' }) => {
	return (
		<div style={{ paddingRight: '16px' }}>
			<Image
				className={cn('max-w-[200px]', className)}
				src={ikonix}
				alt='Ikonix Logo'
			/>
		</div>
	);
};

export default Logo;