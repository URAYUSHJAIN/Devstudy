import React from 'react';
import Link from 'next/link';
import { Github, Home, GitPullRequest } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Page Not Found
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. <br />
          But since this is an open-source project, you can help us build it!
        </p>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <GitPullRequest className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Contribute to DevStudy
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Feel free to contribute to the project on GitHub. We are waiting for your pull requests!
          </p>
          <a 
            href="https://github.com/URAYUSHJAIN/Devstudy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition-all gap-2 w-full sm:w-auto"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
