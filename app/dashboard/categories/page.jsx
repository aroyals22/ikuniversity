import { getCategories } from '@/queries/categories';
import { CategoryList } from './_components/category-list';
import { AddCategoryForm } from './_components/add-category-form';

export default async function CategoriesPage() {
	const categories = await getCategories();

	return (
		<div className='p-6'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-2xl font-bold mb-6'>Manage Categories</h1>

				{/* Add Category Form */}
				<div className='mb-8'>
					<AddCategoryForm />
				</div>

				{/* Categories List */}
				<div>
					<h2 className='text-xl font-semibold mb-4'>All Categories</h2>
					<CategoryList categories={categories} />
				</div>
			</div>
		</div>
	);
}
