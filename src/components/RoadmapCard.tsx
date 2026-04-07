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
      data-interactive-card="true"
      className="group relative block p-6 bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]"
    >
      <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
      <div className="flex items-start justify-between mb-4">
        <div data-icon-wrapper="true" className="p-3 bg-(--c2) rounded-xl group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
          <Icon className="w-6 h-6 text-(--c4d)" />
        </div>
        <ArrowRight className="w-5 h-5 text-(--c4) group-hover:text-(--c4d) transition-colors -rotate-45 group-hover:rotate-0 transform duration-300" />
      </div>
      
      <h3 className="text-xl font-bold text-(--ink) mb-2 group-hover:text-(--c4d) transition-colors tracking-[-0.8px]">
        {roadmap.title}
      </h3>
      
      <p className="text-(--muted) text-sm leading-relaxed">
        {roadmap.description}
      </p>
    </a>
  );
};

export default RoadmapCard;
