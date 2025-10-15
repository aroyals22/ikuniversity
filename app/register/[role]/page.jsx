import React from 'react';
import { redirect } from 'next/navigation';
import { SignupForm } from '../_components/signup-form';

const VALID_ROLES = ['student', 'instructor'];

const RegisterPage = async ({ params }) => {
	const { role } = await params;

	// Redirect invalid roles to student registration
	if (!VALID_ROLES.includes(role)) {
		redirect('/register/student');
	}

	return (
		<div className='w-full h-screen flex flex-col items-center justify-center'>
			<div className='container'>
				<SignupForm role={role} />
			</div>
		</div>
	);
};

export default RegisterPage;