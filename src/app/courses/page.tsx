import React from 'react';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/data/courses';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-(--c1) pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-(--ink) tracking-[-1.5px] mb-4">Free Engineering Courses</h1>
          <p className="text-lg text-(--muted)">
            Curated high-quality courses from FreeCodeCamp and top instructors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
