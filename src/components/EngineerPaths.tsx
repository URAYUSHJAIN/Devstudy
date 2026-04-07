import React from 'react';
import Link from 'next/link';
import { Map, FlaskConical, ArrowRight } from 'lucide-react';

const EngineerPaths = () => {
  return (
    <section className="py-20 bg-(--c1)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Guided Engineering Paths */}
          <div data-interactive-card="true" className="group relative p-8 rounded-2xl bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]">
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
            <div data-icon-wrapper="true" className="w-11 h-11 bg-(--c2) rounded-xl flex items-center justify-center mb-6 group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
              <Map className="w-6 h-6 text-(--c4d)" />
            </div>
            <h3 className="text-2xl font-bold text-(--ink) tracking-[-1px] mb-3">
              Guided Engineering Paths
            </h3>
            <p className="text-(--muted) mb-8 leading-relaxed">
              Role-based learning paths for frontend, backend, full-stack, and AI engineers. 
              Curated by industry veterans to take you from junior to senior.
            </p>
            <Link href="/roadmaps" className="inline-flex items-center text-(--c4d) font-semibold hover:text-(--ink) transition-colors group-hover:translate-x-1">
              Explore Roadmaps <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Hands-on Coding Labs */}
          <div data-interactive-card="true" className="group relative p-8 rounded-2xl bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]">
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
            <div data-icon-wrapper="true" className="w-11 h-11 bg-(--c2) rounded-xl flex items-center justify-center mb-6 group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
              <FlaskConical className="w-6 h-6 text-(--c4d)" />
            </div>
            <h3 className="text-2xl font-bold text-(--ink) tracking-[-1px] mb-3">
              Hands-on Coding Labs
            </h3>
            <p className="text-(--muted) mb-8 leading-relaxed">
              Practice in real environments with projects, code reviews, and challenges.
              No setup required. Just code, run, and deploy.
            </p>
            <Link href="/labs" className="inline-flex items-center text-(--c4d) font-semibold hover:text-(--ink) transition-colors group-hover:translate-x-1">
              Enter Labs <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EngineerPaths;
