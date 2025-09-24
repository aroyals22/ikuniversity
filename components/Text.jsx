'use client';

import React from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Text = () => {
	const handleClick = (mode) => {
		mode ? toast.success('Test Success') : toast.error('Test Error!');
	};

	return (
		<div>
			<Button
				className='bg-red-400'
				variant='default'
				onClick={() => handleClick(true)}
			>
				hello
			</Button>
		</div>
	);
};

export default Text;
