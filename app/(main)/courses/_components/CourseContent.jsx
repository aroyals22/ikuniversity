'use client';
import { useState, useMemo } from 'react';
import SearchCourse from './SearchCourse';
import SortCourse from './SortCourse';
import FilterCourseMobile from './FilterCourseMobile';
import ActiveFilters from './ActiveFilters';
import FilterCourse from './FilterCourse';
import CourseCard from './CourseCard';

export default function CoursesContent({ courses, categories }) {
	const [filter, setFilter] = useState({
		categories: [],
		price: [],
		sort: '',
		search: '',
	});

	const filteredCourses = useMemo(() => {
		let filtered = [...courses];

		if (filter.categories.length > 0) {
			filtered = filtered.filter((course) =>
				filter.categories.includes(course.category?.title?.toLowerCase())
			);
		}

		if (filter.price.length > 0) {
			filtered = filtered.filter((course) => {
				const isFree = course.price === 0;
				const isPaid = course.price > 0;
				return (
					(filter.price.includes('free') && isFree) ||
					(filter.price.includes('paid') && isPaid)
				);
			});
		}

		return filtered;
	}, [courses, filter]);

	return (
		<>
			<div className='flex items-baseline justify-between border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row'>
				<SearchCourse />
				<div className='flex items-center justify-end gap-2 max-lg:w-full'>
					<SortCourse />
					<FilterCourseMobile />
				</div>
			</div>

			<ActiveFilters filter={filter} setFilter={setFilter} />

			<section className='pb-24 pt-6'>
				<div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4'>
					<FilterCourse
						categories={categories}
						filter={filter}
						setFilter={setFilter}
					/>

					<div className='lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
						{filteredCourses.length > 0 ? (
							filteredCourses.map((course) => (
								<CourseCard key={course.id} course={course} />
							))
						) : (
							<div className='col-span-full text-center py-12 text-gray-500'>
								No courses found
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
