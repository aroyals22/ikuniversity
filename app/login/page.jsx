import { LoginForm } from "./_components/login-form";
import { AuthHeader } from '@/components/auth-header';

const LoginPage = () => {
  return (
		<>
			<AuthHeader />
			<div className='w-full flex-col h-[calc(100vh-80px)] flex items-center justify-center'>
				<div className='container'>
					<LoginForm />
				</div>
			</div>
		</>
	);
};
export default LoginPage;