import React from 'react';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/data/courses';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Free Engineering Courses</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Curated high-quality courses from FreeCodeCamp and top instructors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
