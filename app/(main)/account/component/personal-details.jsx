'use client';
import React from 'react';
import { Label } from '@/components/ui/label';

const PersonalDetails = ({ userInfo }) => {
	return (
		<div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900'>
			<h5 className='text-lg font-semibold mb-4'>User Information :</h5>
			<div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
				<div>
					<Label className='mb-2 block'>First Name :</Label>
					<p className='text-gray-900 dark:text-gray-100 font-medium'>
						{userInfo.firstName}
					</p>
				</div>
				<div>
					<Label className='mb-2 block'>Last Name :</Label>
					<p className='text-gray-900 dark:text-gray-100 font-medium'>
						{userInfo.lastName}
					</p>
				</div>
				<div>
					<Label className='mb-2 block'>Your Email :</Label>
					<p className='text-gray-900 dark:text-gray-100 font-medium'>
						{userInfo.email}
					</p>
				</div>
			</div>
		</div>
	);
};

export default PersonalDetails;