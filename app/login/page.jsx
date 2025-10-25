import { LoginForm } from "./_components/login-form";
import MainNav from '@/components/MainNav';

const navItems = [
	{ title: 'Courses', href: '/courses' },
	{ title: 'Testimonials', href: '/#testimonials' },
	{ title: 'Contact', href: '/contact' },
];

const LoginPage = () => {
  return (
		<>
			<header className='container z-40 bg-white'>
				<div className='flex h-20 items-center justify-between py-6'>
					<MainNav items={navItems} />
				</div>
			</header>
			<div className='w-full flex-col h-[calc(100vh-80px)] flex items-center justify-center'>
				<div className='container'>
					<LoginForm />
				</div>
			</div>
		</>
	);
};
export default LoginPage;