import React from 'react';
import { redirect } from 'next/navigation';
import { SignupForm } from '../_components/signup-form';
import MainNav from '@/components/MainNav';

const VALID_ROLES = ['student', 'instructor'];

const navItems = [
	{ title: 'Courses', href: '/courses' },
	{ title: 'Testimonials', href: '/#testimonials' },
	{ title: 'Contact', href: '/contact' },
];

const RegisterPage = async ({ params }) => {
	const { role } = await params;

	// Redirect invalid roles to student registration
	if (!VALID_ROLES.includes(role)) {
		redirect('/register/student');
	}

	return (
		<>
			<header className='container z-40 bg-white'>
				<div className='flex h-20 items-center justify-between py-6'>
					<MainNav items={navItems} />
				</div>
			</header>
			<div className='w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center'>
				<div className='container'>
					<SignupForm role={role} />
				</div>
			</div>
		</>
	);
};

export default RegisterPage;