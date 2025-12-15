import React from 'react';
import { Bookmark, Star, Users, Layers } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Build Scalable SaaS with Next.js',
    instructor: 'Sarah Drasner',
    tech: 'Next.js',
    projects: 3,
    difficulty: 'Intermediate',
    type: 'Paid',
    students: '12k',
    videoId: 'KjY94sAKLlw',
  },
  {
    id: 2,
    title: 'System Design for Backend Engineers',
    instructor: 'Alex Xu',
    tech: 'System Design',
    projects: 5,
    difficulty: 'Advanced',
    type: 'Paid',
    students: '8.5k',
    videoId: 'i53Gi_K3o7I',
  },
  {
    id: 3,
    title: 'AI-Powered Full-Stack Apps',
    instructor: 'Andrew Ng',
    tech: 'AI / ML',
    projects: 4,
    difficulty: 'Intermediate',
    type: 'Free',
    students: '25k',
    videoId: 'reUZRyXxUs4',
  },
  {
    id: 4,
    title: 'Production-Ready DevOps',
    instructor: 'Kelsey Hightower',
    tech: 'DevOps',
    projects: 6,
    difficulty: 'Advanced',
    type: 'Paid',
    students: '10k',
    videoId: 'fqMOX6JJhGo',
  },
];

const CoursesGrid = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Popular Engineering Courses
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Master the latest technologies with hands-on projects.
            </p>
          </div>
          <a href="/courses" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline hidden sm:block">
            View all courses
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Card Header / Thumbnail Placeholder */}
              <div className="h-32 bg-slate-100 dark:bg-slate-800 relative p-4 flex flex-col justify-between overflow-hidden">
                {/* Video Thumbnail Background */}
                <img 
                  src={`https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} 
                  alt={course.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 transition-colors group-hover:bg-black/50" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 rounded backdrop-blur-sm">
                    {course.tech}
                  </span>
                  <button className="text-white/70 hover:text-white transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative z-10 flex items-center space-x-2 text-xs text-white/90">
                  <span className={`px-2 py-0.5 rounded-full border ${
                    course.type === 'Free' 
                      ? 'border-green-400/30 bg-green-500/20 text-green-100' 
                      : 'border-indigo-400/30 bg-indigo-500/20 text-indigo-100'
                  }`}>
                    {course.type}
                  </span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  by <span className="text-slate-700 dark:text-slate-300 font-medium">{course.instructor}</span>
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <Layers className="w-4 h-4 mr-1" />
                    {course.projects} Projects
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            View all courses
          </a>
        </div>
      </div>
    </section>
  );
};

export default CoursesGrid;
