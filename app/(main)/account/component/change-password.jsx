'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/app/actions/account';
import { toast } from 'sonner';

const ChangePassword = ({ email }) => {
	const [passwordState, setPasswordState] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleChange = (event) => {
		const key = event.target.name;
		const value = event.target.value;
		setPasswordState({
			...passwordState,
			[key]: value,
		});
	};

	async function doPasswordChange(event) {
		event.preventDefault();

		// Frontend validation
		if (passwordState.newPassword !== passwordState.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		if (passwordState.newPassword.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		try {
			await changePassword(
				email,
				passwordState?.oldPassword,
				passwordState?.newPassword
			);
			toast.success('Password changed successfully');
			// Clear form after successful change
			setPasswordState({
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		}
	}

	return (
		<div>
			<h5 className='text-lg font-semibold mb-4'>Change password :</h5>
			<form onSubmit={doPasswordChange}>
				<div className='grid grid-cols-1 gap-5'>
					<div>
						<Label className='mb-2 block'>Old password :</Label>
						<Input
							type='password'
							placeholder='Old password'
							id='oldPassword'
							name='oldPassword'
							value={passwordState.oldPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<Label className='mb-2 block'>New password :</Label>
						<Input
							type='password'
							placeholder='New password (min 8 characters)'
							required
							id='newPassword'
							name='newPassword'
							value={passwordState.newPassword}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label className='mb-2 block'>Re-type New password :</Label>
						<Input
							type='password'
							placeholder='Re-type New password'
							required
							id='confirmPassword'
							name='confirmPassword'
							value={passwordState.confirmPassword}
							onChange={handleChange}
						/>
					</div>
				</div>
				<Button className='mt-5' type='submit'>
					Save password
				</Button>
			</form>
		</div>
	);
};

export default ChangePassword;