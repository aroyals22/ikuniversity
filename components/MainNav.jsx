'use client';

import React, { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { Menu } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import MobileNav from './MobileNav';
import { useSession, signOut } from 'next-auth/react';

const MainNav = ({ items, children }) => {
	const { data: session } = useSession();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [loginSession, setLoginSession] = useState(null);

	const [loggedInUser, setLoggedInUser] = useState(null);

	useEffect(() => {
		setLoginSession(session);
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
	}, [session]);
	return (
		<>
			<div className='flex gap-6 lg:gap-10'>
				<Link href='/'>
					<Logo />
				</Link>

				{items?.length ? (
					<nav className='hidden gap-6 lg:flex'>
						{items?.map((item, index) => (
							<Link
								key={index}
								href={item.disable ? '#' : item.href}
								className={cn(
									'flex items-center text-base md:text-lg font-semibold text-foreground transition-colors hover:text-primary'
								)}
							>
								{item.title}
							</Link>
						))}
					</nav>
				) : null}

				{showMobileMenu && items && (
					<MobileNav items={items}>{children}</MobileNav>
				)}
			</div>

			{/* Login/Register section */}

			<nav className='flex items-center gap-3'>
				{!loginSession && (
					<div className='items-center gap-3 hidden lg:flex'>
						<Link
							href='/login'
							className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
						>
							Login
						</Link>

						{/* DropDown area */}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className='cursor-pointer' variant='outline' size='sm'>
									Register
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align='end' className='w-56 mt-4'>
								<DropdownMenuItem className='cursor-pointer' asChild>
									<Link href='/register/student'>Student</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				{loginSession && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className='cursor-pointer'>
								<Avatar>
									<AvatarFallback>
										{loggedInUser?.firstName?.[0]}
										{loggedInUser?.lastName?.[0]}
									</AvatarFallback>
								</Avatar>
							</div>
						</DropdownMenuTrigger>

						<DropdownMenuContent align='end' className='w-56 mt-4'>
							<DropdownMenuItem className='cursor-pointer' asChild>
								<Link href='/account'>Profile</Link>
							</DropdownMenuItem>

							{loggedInUser?.role === 'instructor' && (
								<DropdownMenuItem className='cursor-pointer' asChild>
									<Link href='/dashboard'>
										<strong>Instructor Dashboard</strong>
									</Link>
								</DropdownMenuItem>
							)}

							<DropdownMenuItem className='cursor-pointer' asChild>
								<Link href='/account/enrolled-courses'>My Courses</Link>
							</DropdownMenuItem>

							<DropdownMenuItem className='cursor-pointer' asChild>
								<Link
									href=''
									onClick={(e) => {
										e.preventDefault();
										signOut({ callbackUrl: '/' });
									}}
								>
									Logout
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				<button
					className='flex items-center space-x-2 lg:hidden'
					onClick={() => setShowMobileMenu(!showMobileMenu)}
				>
					{showMobileMenu ? <X /> : <Menu />}
				</button>
			</nav>
		</>
	);
};

export default MainNav;