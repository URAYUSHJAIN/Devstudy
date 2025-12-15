import React from 'react';
import Link from 'next/link';
import { Map, FlaskConical, ArrowRight } from 'lucide-react';

const EngineerPaths = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Guided Engineering Paths */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
              <Map className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Guided Engineering Paths
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Role-based learning paths for frontend, backend, full-stack, and AI engineers. 
              Curated by industry veterans to take you from junior to senior.
            </p>
            <Link href="/roadmaps" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group-hover:translate-x-1">
              Explore Roadmaps <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Hands-on Coding Labs */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors group">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6">
              <FlaskConical className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Hands-on Coding Labs
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Practice in real environments with projects, code reviews, and challenges.
              No setup required. Just code, run, and deploy.
            </p>
            <Link href="/labs" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group-hover:translate-x-1">
              Enter Labs <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EngineerPaths;
