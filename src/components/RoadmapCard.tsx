import React from 'react';
import { ArrowRight, Layout, Server, Layers, Cloud, Brain } from 'lucide-react';

const icons = {
  Layout,
  Server,
  Layers,
  Cloud,
  Brain,
};

interface RoadmapProps {
  roadmap: {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: string;
  };
}

const RoadmapCard: React.FC<RoadmapProps> = ({ roadmap }) => {
  // @ts-ignore
  const Icon = icons[roadmap.icon] || Layers;

  return (
    <a 
      href={roadmap.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors -rotate-45 group-hover:rotate-0 transform duration-300" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {roadmap.title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
        {roadmap.description}
      </p>
    </a>
  );
};

export default RoadmapCard;
