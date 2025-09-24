import Image from 'next/image';
import React from 'react';

const Element = () => {
	return (
		<div className='bg-darkBlue min-h-screen px-0 py-12'>
			<div className='w-full bg-blue-50 p-6 flex flex-col md:flex-row items-center pt-5 pb-10 ps-10'>
				<div className='md:w-1/2 text-center md:text-left pt-10 pb-10'>
					<h3 className='text-red-900 font-semibold text-lg mb-2'>
						Fast-Track your learning
					</h3>
					<h2 className='text-gray-800 font-bold text-5xl mb-4'>
						Learn From The Experts
					</h2>
					<p className='text-gray-600'>
						From absolute beginner to Qualified Electrical Safety Tester. Gain
						the skills necessary to build confidence in your testing procedures
						while gaining the skills to trouble-shoot any unexpected issues
						which may hold back production
					</p>
				</div>
				<div className='md:w-1/2 flex justify-center mt-6 md:mt-0'>
					<Image
						src='/assets/images/workstationfinal.png'
						alt='testing product'
						width={600}
						height={500}
						className='rounded-lg'
					/>
				</div>
			</div>
		</div>
	);
};

export default Element;
