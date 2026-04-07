import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const isFree = course.difficulty !== 'Advanced';

  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <div
        data-interactive-card="true"
        className="relative bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl overflow-hidden group-hover:border-(--c4) group-hover:-translate-y-0.75 group-hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)] h-full flex flex-col"
      >
        <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
        {/* Thumbnail Placeholder */}
        <div className="h-40 bg-[linear-gradient(135deg,var(--c2),var(--c3))] relative flex items-center justify-center overflow-hidden">
          {course.videoId ? (
            <>
              <Image
                src={`https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} 
                alt={course.title} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <PlayCircle className="absolute w-12 h-12 text-white/90 drop-shadow-lg group-hover:scale-110 transition-transform" />
            </>
          ) : (
            <PlayCircle className="w-12 h-12 text-(--c4d) transition-colors" />
          )}
          
          <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
            isFree
                ? 'bg-[rgba(113,201,206,0.2)] text-(--c4d)'
                : 'bg-[rgba(13,43,44,0.08)] text-(--ink)'
          }`}>
            {isFree ? 'Free' : 'Paid'}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[11px] font-bold text-(--c4d) tracking-[0.06em] uppercase mb-2">
            {course.tech[0]}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {course.tech.slice(0, 3).map((tag, index) => (
              <span key={`${tag}-${index}`} className="px-2 py-1 text-xs font-medium bg-(--c2) text-(--ink2) rounded">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-(--ink) mb-2 line-clamp-2 group-hover:text-(--c4d) transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-(--muted) mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(113,201,206,0.28)] mt-auto text-[12px]">
            <div className="flex items-center text-(--muted)">
              <BarChart className="w-3 h-3 mr-1" />
              {course.difficulty}
            </div>
            <div className="flex items-center text-(--muted)">
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
