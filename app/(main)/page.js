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
			<section className='pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 grainy'>
				<div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center relative isolate'>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
					>
						<div
							style={{
								clipPath:
									'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
							}}
							className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#B92234] to-[#E63946] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
						/>
					</div>
					{/* <span className='rounded-2xl bg-[#007AFF] text-white px-4 py-1.5 text-sm font-medium border shadow-lg'>
						Welcome
					</span> */}
					<h1 className='font-heading text-3xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl'>
						Ikonix Training
					</h1>
					<h2 className='font-heading text-3xl font-medium sm:text-5xl md:text-6xl lg:text-7xl'>
						Press{' '}
						<Play className='inline h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16' />{' '}
						Before You Press{' '}
						<span className='inline-block text-white bg-green-500 px-3 py-1.5 rounded-lg shadow-lg border-b-4 border-green-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
							TEST
						</span>
					</h2>
					<p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
						Utilize our training modules to qualify your team. This ensures safe
						workstations, valid testing results and on-time production.
					</p>
					<div className='flex items-center gap-3 flex-wrap justify-center'>
						<Link
							href='/courses'
							className={cn(buttonVariants({ size: 'lg' }))}
						>
							Explore Now
						</Link>
						<Link
							href='/register/instructor'
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
						>
							Become An Instructor
						</Link>
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
											src={`/assets/images/categories/${category.thumbnail}`}
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
