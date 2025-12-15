import React from 'react';
import { courses } from '@/data/courses';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/courses" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Video Embed */}
          <div className="aspect-video w-full bg-black relative group">
            {course.videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${course.videoId}?rel=0&modestbranding=1`}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <p className="text-slate-400">Video not available</p>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tech.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {course.title}
            </h1>

            <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {course.instructor}
              </div>
              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                {course.difficulty}
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-3">About this course</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {course.description}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                This content is embedded from YouTube and is provided for educational purposes. 
                All rights belong to the original creator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
