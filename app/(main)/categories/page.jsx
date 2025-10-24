import { getCategories } from '@/queries/categories';
import { SectionTitle } from '@/components/SectionTitle';
import Image from 'next/image';
import Link from 'next/link';

const CategoriesPage = async () => {
	const categories = await getCategories();

	return (
		<section className='container py-12'>
			<SectionTitle className='text-3xl font-bold mb-8'>
				All Categories
			</SectionTitle>

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
							<div className='w-full max-w-[280px] aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/9] rounded-lg bg-muted/30 grid place-items-center'>
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
	);
};

export default CategoriesPage;
