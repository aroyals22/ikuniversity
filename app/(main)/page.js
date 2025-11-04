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
			<section className='relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center'>
				{/* Subtle gradient accent */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl'
				></div>

				<div className='container relative z-10 py-16 lg:py-24'>
					<div className='grid lg:grid-cols-2 gap-8 items-center'>
						{/* Left side - Your catchphrase hero */}
						<div className='space-y-4'>
							{/* Title with left-aligned underline */}
							<div className='text-center'>
								<h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-white'>
									Ikonix Training
								</h1>
								<div className='h-1.5 bg-gradient-to-r from-[#670c0c] to-white/50 rounded-full mt-3 max-w-lg ' />
							</div>

							{/* Catchphrase and TEST button */}
							<h2 className='text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight text-center'>
								Press{' '}
								<Play className='inline h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white' />{' '}
								Before You Press
								<div className='flex justify-center mt-3'>
									<span className='inline-block text-white bg-green-500 px-3 py-1.5 rounded-lg shadow-lg border-b-4 border-green-700 text-2xl sm:text-3xl lg:text-4xl font-bold'>
										TEST
									</span>
								</div>
							</h2>

							<p className='text-lg text-gray-200 leading-relaxed text-center max-w-2xl mx-auto'>
								Empower your team with the knowledge to work safely, achieve
								valid test results, and resolve challenges efficiently, ensuring
								consistent, on-time production.
							</p>

							{/* Explore Courses button */}
							<div className='flex justify-center'>
								<Link
									href='/courses'
									className='bg-black text-white hover:bg-gray-900 px-10 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg'
								>
									Explore Courses
								</Link>
							</div>
						</div>

						{/* Right side - Trust signals & stats */}
						<div className='space-y-4'>
							{/* Trust badge */}
							<div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-full text-sm font-semibold border border-white/30'>
								<span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
								Courses Live & Ready to Enroll
							</div>

							{/* Stats cards with white frosted glass */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30'>
									<div className='text-3xl font-bold text-white mb-1'>10+</div>
									<div className='text-xs text-gray-200'>
										Years Training Engineers
									</div>
								</div>

								<div className='bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30'>
									<div
										className='text-3xl font-bold text-yellow-400 mb-1'
										style={{
											textShadow:
												'2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)',
										}}
									>
										4.9★
									</div>
									<div className='text-xs text-gray-200'>Average Rating</div>
								</div>

								<div className='bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30'>
									<div className='text-3xl font-bold text-white mb-1'>
										Since 1936
									</div>
									<div className='text-xs text-gray-200'>Industry Leader</div>
								</div>

								<div className='bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30'>
									<div className='text-3xl font-bold text-white mb-1'>24/7</div>
									<div className='text-xs text-gray-200'>Access Anytime</div>
								</div>
							</div>

							{/* Value props checklist with white frosted glass */}
							<div className='bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30'>
								<h3 className='font-semibold text-white mb-3 text-sm'>
									What You Get:
								</h3>
								<div className='grid grid-cols-2 gap-x-4 gap-y-3'>
									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Model Specific Training
											</div>
											<div className='text-xs text-gray-200'>
												From Applications Engineers
											</div>
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Self-Paced Learning
											</div>
											<div className='text-xs text-gray-200'>
												Learn at your speed
											</div>
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Knowledge Assessments
											</div>
											<div className='text-xs text-gray-200'>
												Verify knowledge retention with quizzes
											</div>
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Real-World Scenarios
											</div>
											<div className='text-xs text-gray-200'>
												Practical troubleshooting
											</div>
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Instant Certificates
											</div>
											<div className='text-xs text-gray-200'>
												Download on completion
											</div>
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<div className='w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
											<svg
												className='w-2.5 h-2.5 text-white'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</div>
										<div>
											<div className='font-medium text-white text-sm'>
												Mobile Accessible
											</div>
											<div className='text-xs text-gray-200'>
												Learn anywhere
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
