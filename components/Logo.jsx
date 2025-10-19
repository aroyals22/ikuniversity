import Image from 'next/image';
import React from 'react';
import ikonix from '@/public/assets/images/Ikonix-Logo.png';
import { cn } from '@/lib/utils';

const Logo = ({ className = '' }) => {
	return (
		<Image
			className={cn('max-w-[200px] mr-4', className)}
			src={ikonix}
			alt='Ikonix Logo'
		/>
	);
};

export default Logo;