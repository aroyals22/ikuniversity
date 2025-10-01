import React from 'react';
import Logo from './Logo.jsx';

const Footer = () => {
	return (
		<footer className='bg-gray-100 py-6'>
			<div className='container flex flex-col items-center gap-3 text-center'>
				<Logo className='h-10 w-auto' />
				<p className='text-sm text-gray-700'>
					Contact us:{' '}
					<a href='mailto:info@ikonix.com' className='underline'>
						info@ikonix.com
					</a>{' '}
					· 847.367.4671
					<br />© 2025 IKONIX. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
};
export default Footer;
