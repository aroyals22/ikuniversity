'use client';

import Logo from '@/components/Logo';
import { MobileSidebar } from './mobile-sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export const Navbar = () => {
	const [loggedInUser, setLoggedInUser] = useState(null);

	useEffect(() => {
		async function fetchMe() {
			try {
				const response = await fetch('/api/me');
				if (response.status === 401) {
					// User not authenticated, that's okay
					setLoggedInUser(null);
					return;
				}
				if (!response.ok) {
					throw new Error('Failed to fetch user');
				}
				const data = await response.json();
				setLoggedInUser(data);
			} catch (error) {
				// Silent fail - don't show error to user
				setLoggedInUser(null);
			}
		}
		fetchMe();
	}, []);

	return (
		<div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
			<MobileSidebar />
			<div className='flex items-center justify-end  w-full'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className='cursor-pointer'>
							<Avatar>
								<AvatarImage src={loggedInUser?.profilePicture} alt='@shadcn' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-56 mt-4'>
						<DropdownMenuItem className='cursor-pointer'>
							<Link href='/account'>Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer'>
							<Link
								href='#'
								onClick={() => {
									signOut({ callbackUrl: '/' });
								}}
							>
								Logout
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};