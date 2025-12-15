import React from 'react';
import Link from 'next/link';
import { PlayCircle, Layers, BarChart } from 'lucide-react';

interface CourseProps {
  course: {
    id: string;
    slug: string;
    title: string;
    instructor: string;
    tech: string[];
    difficulty: string;
    projects: number;
    description: string;
    videoId?: string;
  };
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-all h-full flex flex-col">
        {/* Thumbnail Placeholder */}
        <div className="h-40 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors overflow-hidden">
          {course.videoId ? (
            <>
              <img 
                src={`https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <PlayCircle className="absolute w-12 h-12 text-white/90 drop-shadow-lg group-hover:scale-110 transition-transform" />
            </>
          ) : (
            <PlayCircle className="w-12 h-12 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          )}
          
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-medium">
            Free
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {course.tech.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <BarChart className="w-3 h-3 mr-1" />
              {course.difficulty}
            </div>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Layers className="w-3 h-3 mr-1" />
              {course.projects} Projects
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
