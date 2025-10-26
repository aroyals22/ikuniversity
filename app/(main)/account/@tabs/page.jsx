import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import PersonalDetails from '../component/personal-details';
import ChangePassword from '../component/change-password';
// Remove: import ContactInfo from '../component/contact-info';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { ChartNoAxesColumnDecreasing } from 'lucide-react';

async function Profile() {
	const session = await auth();
	const loggedInUser = await getUserByEmail(session?.user?.email);

	return (
		<>
			<PersonalDetails userInfo={loggedInUser} />
			<div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]'>
				<ChangePassword email={loggedInUser?.email} />
			</div>
		</>
	);
}

export default Profile;