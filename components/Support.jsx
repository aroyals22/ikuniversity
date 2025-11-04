import Image from 'next/image';
import React from 'react';

const Support = () => {
	return (
		<div className='bg-darkBlue text-black py-5 px-4 md:px-16  border-gray-700'>
			<div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center space-y-12 md:space-y-0 md:space-x-8'>
				<div className='flex-1'>
					<p className='mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:leading-tight font-poppins'>
						<span className='relative inline-flex sm:inline'>
							<span className='bg-gradient-to-r from-[#5f5bd3] via-[#f7f5f5] to-[#200565] blur-2xl filter opacity-50 w-full h-full absolute inset-0'></span>
							<span className='relative'>Prefer Hands On Training?</span>
						</span>
					</p>

					<p className='text-black leading-relaxed mb-8 mt-8'>
						With Applications Consulting we can build a package which suits your
						training or test setup needs. Our Application team has combined for
						over 30 years of experience helping customers solve their testing
						application needs. They will come to your facility, train your
						staff, setup your new equipment and make sure you're testing your
						products to every standard necessary.
					</p>

					<div className='flex flex-wrap gap-4'>
						<a
							href='https://www.ikonixusa.com/app-support'
							className='bg-neutral-300 text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-red-800 transition'
						>
							Contact Us
						</a>

						<a
							href='https://www.ikonixusa.com/about/contact'
							className='bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-900 transition'
						>
							Call for Support
						</a>
					</div>
				</div>

				<div className='flex-1 flex justify-center'>
					<Image
						src='/assets/images/support1.png'
						alt='Support'
						width={500}
						height={400}
						className='rounded-lg'
					/>
				</div>
			</div>
		</div>
	);
};

export default Support;
