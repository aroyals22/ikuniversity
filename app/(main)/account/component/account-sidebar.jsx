import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './account-menu';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';

const AccountSidebar = async () => {
	const session = await auth();
	if (!session?.user) {
		redirect('/login');
	}

	const loggedInUser = await getUserByEmail(session?.user?.email);

	return (
		<div className='lg:w-1/4 md:px-3'>
			<div className='relative'>
				<div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900'>
					<div className='profile-pic text-center mb-5'>
						<input
							id='pro-img'
							name='profile-image'
							type='file'
							className='hidden'
						/>
						<div>
							<div className='size-28 mx-auto bg-primary text-white rounded-full flex items-center justify-center text-2xl font-semibold shadow ring-4 ring-slate-50 dark:ring-slate-800'>
								{loggedInUser?.firstName?.[0]}
								{loggedInUser?.lastName?.[0]}
							</div>
							<div className='mt-4'>
								<h5 className='text-lg font-semibold'>
									{' '}
									{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
								</h5>
								<p className='text-slate-400'>{loggedInUser?.email}</p>
								<p className='text-slate-700 text-sm font-semibold'>
									{loggedInUser?.role}
								</p>
							</div>
						</div>
					</div>
					<div className='border-t border-gray-100 dark:border-gray-700'>
						<Menu />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountSidebar;
