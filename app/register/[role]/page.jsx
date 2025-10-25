import React from 'react';
import { redirect } from 'next/navigation';
import { SignupForm } from '../_components/signup-form';
import { AuthHeader } from '@/components/auth-header';

const VALID_ROLES = ['student', 'instructor'];

const RegisterPage = async ({ params }) => {
	const { role } = await params;

	// Redirect invalid roles to student registration
	if (!VALID_ROLES.includes(role)) {
		redirect('/register/student');
	}

	return (
		<>
			<AuthHeader />
			<div className='w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center'>
				<div className='container'>
					<SignupForm role={role} />
				</div>
			</div>
		</>
	);
};

export default RegisterPage;