import Element from '@/components/Element';
import { SectionTitle } from '@/components/SectionTitle';
import Support from '@/components/Support';
import { Button, buttonVariants } from '@/components/ui/button';
import { formatPrice } from '@/lib/formatPrice';
import { cn } from '@/lib/utils';
import { getCourseList } from '@/queries/courses';
import { BookOpen } from 'lucide-react';
import { ArrowRightIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CourseCard from './courses/_components/CourseCard';
import { getCategories } from '@/queries/categories';
import { Play } from 'lucide-react';

const HomePage = async () => {
	const courses = await getCourseList();
	const categories = await getCategories();

	return (
		<>
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-50 to-white'>
				{/* Subtle gradient blob in background */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl'
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[20%] top-[10%] aspect-[1155/678] w-[50rem] bg-gradient-to-tr from-[#670c0c] via-[#8b5cf6] to-[#60a5fa] opacity-20'
					/>
				</div>

				<div className='container'>
					<div className='grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32'>
						{/* Left side - Your catchphrase hero */}
						<div className='space-y-8'>
							<div>
								<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900'>
									Ikonix Training
								</h1>
								<div className='h-1.5 bg-gradient-to-r from-[#670c0c] to-[#d1d5db] rounded-full mt-3 max-w-xs' />
							</div>

							<h2 className='text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight'>
								Press{' '}
								<Play className='inline h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12' />{' '}
								Before You Press{' '}
								<span className='inline-block text-white bg-green-500 px-3 py-1.5 rounded-lg shadow-lg border-b-4 border-green-700 text-2xl sm:text-3xl lg:text-4xl font-bold'>
									TEST
								</span>
							</h2>

							<p className='text-lg text-gray-600 leading-relaxed'>
								Utilize our training modules to qualify your team. This ensures
								safe workstations, valid testing results and on-time production.
							</p>

							<div className='flex flex-col sm:flex-row gap-4'>
								<Link
									href='/courses'
									className={cn(
										buttonVariants({ size: 'lg' }),
										'bg-[#670c0c] hover:bg-[#7d0e0e] text-white'
									)}
								>
									Explore Courses
								</Link>
								<Link
									href='#preview'
									className={cn(
										buttonVariants({ size: 'lg', variant: 'outline' })
									)}
								>
									Watch Demo
								</Link>
							</div>
						</div>

						{/* Right side - Trust signals & stats */}
						<div className='space-y-6'>
							{/* Trust badge */}
							<div className='inline-flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-2.5 rounded-full text-sm font-semibold border border-blue-200'>
								<span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
								Trusted by Engineering Teams Worldwide
							</div>

							{/* Stats cards */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
									<div className='text-4xl font-bold text-[#670c0c] mb-2'>
										2,500+
									</div>
									<div className='text-sm text-gray-600'>
										Engineers Certified
									</div>
								</div>

								<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
									<div className='text-4xl font-bold text-green-600 mb-2'>
										4.9★
									</div>
									<div className='text-sm text-gray-600'>Average Rating</div>
								</div>

								<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
									<div className='text-4xl font-bold text-blue-600 mb-2'>
										100%
									</div>
									<div className='text-sm text-gray-600'>Pass Rate</div>
								</div>

								<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
									<div className='text-4xl font-bold text-purple-600 mb-2'>
										24/7
									</div>
									<div className='text-sm text-gray-600'>Access Anytime</div>
								</div>
							</div>

							{/* Value props checklist */}
							<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-4'>
								<h3 className='font-semibold text-gray-900 mb-4'>
									What You Get:
								</h3>
								<div className='space-y-3'>
									<div className='flex items-start gap-3'>
										<div className='w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-3 h-3 text-green-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-gray-900'>
												Industry Certified Content
											</div>
											<div className='text-sm text-gray-600'>
												Approved training materials
											</div>
										</div>
									</div>

									<div className='flex items-start gap-3'>
										<div className='w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-3 h-3 text-green-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-gray-900'>
												Self-Paced Learning
											</div>
											<div className='text-sm text-gray-600'>
												Learn at your own speed
											</div>
										</div>
									</div>

									<div className='flex items-start gap-3'>
										<div className='w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-3 h-3 text-green-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-gray-900'>
												Instant Certificates
											</div>
											<div className='text-sm text-gray-600'>
												Download upon completion
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Element />

			{/* Categories Section */}
			<section id='categories' className='container py-8'>
				{/* header */}
				<div className='mb-6 flex items-center justify-between'>
					<SectionTitle className='text-2xl md:text-3xl font-bold tracking-tight'>
						Categories
					</SectionTitle>

					<Link
						href='/categories'
						className='text-sm font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1'
					>
						Browse All <ArrowRightIcon className='h-4 w-4' />
					</Link>
				</div>

				{/* grid */}
				<div className='grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/categories/${category.id}`}
							aria-label={category.title}
							className='group relative overflow-hidden rounded-xl border bg-card transition-all
                   hover:-translate-y-0.5 hover:shadow-md
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<div className='flex flex-col items-center gap-4 p-6'>
								{/* THUMBNAIL — large, consistent, responsive */}
								<div
									className='w-full max-w-[280px] aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/9]
                       rounded-lg bg-muted/30 grid place-items-center'
								>
									{/* Next/Image needs a relative parent when using 'fill' */}
									<div className='relative w-[78%] md:w-[82%] lg:w-[86%] h-full'>
										<Image
											src={
												category.thumbnail?.startsWith('http')
													? category.thumbnail
													: `/assets/images/categories/${category.thumbnail}`
											}
											alt={category.title}
											fill
											className='object-contain'
											sizes='(min-width:1024px) 280px, (min-width:768px) 220px, 180px'
											priority={false}
										/>
									</div>
								</div>

								<h3 className='text-center text-base md:text-lg font-semibold text-foreground'>
									{category.title}
								</h3>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Courses */}
			<section id='courses' className='container space-y-6   md:py-12 lg:py-12'>
				<div className='flex items-center justify-between'>
					<SectionTitle>Courses</SectionTitle>
					<Link
						href={'/courses'}
						className=' text-sm font-medium  hover:opacity-80 flex items-center gap-1'
					>
						Browse All <ArrowRightIcon className='h-4 w-4' />
					</Link>
				</div>
				<div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
					{courses.map((course) => {
						return <CourseCard key={course.id} course={course} />;
					})}
				</div>
			</section>

			<Support />
		</>
	);
};
export default HomePage;
