import React from 'react';
import { SignupForm } from '../_components/signup-form';

const RegisterPage = async ({ params }) => {
	const { role } = await params; // ✅ await params

	return (
		<div className='w-full h-screen flex flex-col items-center justify-center'>
			<div className='container'>
				<SignupForm role={role} />
			</div>
		</div>
	);
};

export default RegisterPage;
