import Link from 'next/link';
import Logo from './Logo';

const navItems = [
	{ title: 'Courses', href: '/courses' },
	{ title: 'Testimonials', href: '/#testimonials' },
	{ title: 'Contact', href: '/contact' },
];

export const AuthHeader = () => {
	return (
		<header className='container z-40 bg-white border-b'>
			<div className='flex h-20 items-center justify-between py-6'>
				<Link href='/'>
					<Logo />
				</Link>
				<nav className='flex gap-6'>
					{navItems.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className='flex items-center text-base md:text-lg font-semibold text-foreground transition-colors hover:text-primary'
						>
							{item.title}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};
