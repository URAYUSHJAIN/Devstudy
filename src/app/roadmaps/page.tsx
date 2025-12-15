import React from 'react';
import RoadmapCard from '@/components/RoadmapCard';
import { roadmaps } from '@/data/roadmaps';

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Engineering Roadmaps</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Step-by-step guides to becoming a modern software engineer. 
            Powered by <a href="https://roadmap.sh" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">roadmap.sh</a>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      </div>
    </div>
  );
}
