import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Users, Layers } from 'lucide-react';

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
    <section className="py-20 bg-(--c1)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-(--ink) tracking-[-1px] mb-2">
              Popular Engineering Courses
            </h2>
            <p className="text-(--muted)">
              Master the latest technologies with hands-on projects.
            </p>
          </div>
          <a href="/courses" className="text-(--c4d) font-medium hover:underline hidden sm:block">
            View all courses
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Link
              href="/courses"
              data-interactive-card="true"
              key={course.id}
              className="relative block bg-[rgba(255,255,255,0.72)] rounded-lg border border-[rgba(113,201,206,0.32)] overflow-hidden group hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]"
            >
              <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
              {/* Card Header / Thumbnail Placeholder */}
              <div className="h-40 bg-[linear-gradient(135deg,var(--c2),var(--c3))] relative p-4 flex flex-col justify-between overflow-hidden">
                {/* Video Thumbnail Background */}
                <Image
                  src={`https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} 
                  alt={course.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.65))] transition-opacity group-hover:opacity-90" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-3 py-1 text-[12px] font-semibold bg-[rgba(227,253,253,0.95)] text-(--ink2) rounded-md backdrop-blur-sm">
                    {course.tech}
                  </span>
                  <span className="p-2 rounded-md border border-white/20 bg-black/20 text-white/80 group-hover:text-white transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </span>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-xs text-white/95">
                  <span className={`px-2 py-1 rounded-md border ${
                    course.type === 'Free' 
                      ? 'bg-[rgba(113,201,206,0.25)] text-[#e8ffff] border-[rgba(113,201,206,0.45)]' 
                      : 'bg-[rgba(13,43,44,0.25)] text-white border-[rgba(13,43,44,0.35)]'
                  }`}>
                    {course.type}
                  </span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="text-xl leading-[1.3] font-bold text-(--ink) mb-2 line-clamp-2 group-hover:text-(--c4d) transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-(--muted) mb-4">
                  by <span className="text-(--ink2) font-medium">{course.instructor}</span>
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[rgba(113,201,206,0.28)]">
                  <div className="flex items-center text-xs text-(--muted)">
                    <Layers className="w-4 h-4 mr-1" />
                    {course.projects} Projects
                  </div>
                  <div className="flex items-center text-xs text-(--muted)">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <a href="#" className="text-(--c4d) font-medium hover:underline">
            View all courses
          </a>
        </div>
      </div>
    </section>
  );
};

export default CoursesGrid;
