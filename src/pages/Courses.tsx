import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { CoursePagination } from '@/components/courses/CoursePagination';
import { mockCourses } from '@/data/mockData';

const COURSES_PER_PAGE = 6;

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let courses = [...mockCourses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.instructor.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      courses = courses.filter((c) => c.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All Levels') {
      courses = courses.filter((c) => c.level === selectedLevel);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        courses.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case 'rating':
        courses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        courses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        courses.sort((a, b) => b.price - a.price);
        break;
    }

    return courses;
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== 'All Categories' && selectedCategory,
    selectedLevel !== 'All Levels' && selectedLevel,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedLevel('All Levels');
    setSortBy('popular');
  };

  return (
    <>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">
            Discover {mockCourses.length}+ courses from expert instructors
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CourseFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedCourses.length} of {filteredCourses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        {paginatedCourses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course, index) => (
                <div key={course.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            <CoursePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No courses found matching your criteria</p>
            <button
              onClick={handleClearFilters}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
