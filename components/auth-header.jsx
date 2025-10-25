'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
	{ title: 'Courses', href: '/courses' },
	{ title: 'Testimonials', href: '/#testimonials' },
	{ title: 'Contact', href: '/contact' },
];

export const AuthHeader = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	return (
		<header className='container z-40 bg-white border-b'>
			<div className='flex h-20 items-center justify-between py-6'>
				{/* Logo */}
				<Link href='/'>
					<Logo />
				</Link>

				{/* Desktop Navigation */}
				<nav className='hidden md:flex gap-6'>
					{navItems.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className='flex items-center text-base md:text-lg font-semibold text-foreground transition-colors hover:text-primary'
						>
							{item.title}
						</Link>
					))}
				</nav>

				{/* Mobile Menu Button */}
				<Button
					variant='ghost'
					size='sm'
					className='md:hidden'
					onClick={() => setShowMobileMenu(!showMobileMenu)}
				>
					{showMobileMenu ? (
						<X className='h-5 w-5' />
					) : (
						<Menu className='h-5 w-5' />
					)}
				</Button>
			</div>

			{/* Mobile Menu */}
			{showMobileMenu && (
				<div className='md:hidden border-t bg-white py-4'>
					<nav className='flex flex-col space-y-3'>
						{navItems.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className='block px-4 py-2 text-base font-medium text-foreground transition-colors hover:text-primary hover:bg-gray-50'
								onClick={() => setShowMobileMenu(false)}
							>
								{item.title}
							</Link>
						))}
					</nav>
				</div>
			)}
		</header>
	);
};
