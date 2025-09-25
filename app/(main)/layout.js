import Footer from '@/components/Footer';
import MainNav from '@/components/MainNav';
import React from 'react';

const navLinks = [
	{
		title: 'Courses',
		href: '/#Courses',
	},
	{
		title: 'Testimonials',
		href: '/#testimonials',
	},
	{
		title: 'Contact',
		href: '/#contact',
	},
];

const MainLayout = ({ children }) => {
	return (
		<div className='flex min-h-screen flex-col'>
			<header className='z-40 bg-background/60 backdrop-blur-md fixed top-0 left-0 right-0 border-b'>
				<div className='container flex h-20 items-center justify-between py-6'>
					<MainNav items={navLinks} />
				</div>
			</header>

			<main className='flex-1 pt-20 flex flex-col'> {children} </main>
			<Footer />
		</div>
	);
};

export default MainLayout;
