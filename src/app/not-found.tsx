import React from 'react';
import Link from 'next/link';
import { Github, Home, GitPullRequest } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--c1) flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-(--c4d) tracking-[-1.5px] mb-4">404</h1>
        <h2 className="text-4xl font-bold text-(--ink) tracking-[-1px] mb-6">
          Page Not Found
        </h2>
        
        <p className="text-lg text-(--muted) mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. <br />
          But since this is an open-source project, you can help us build it!
        </p>

        <div data-interactive-card="true" className="relative bg-[rgba(255,255,255,0.72)] p-8 rounded-2xl border border-[rgba(113,201,206,0.28)] shadow-[0_12px_32px_rgba(113,201,206,0.15)] mb-10">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-[linear-gradient(90deg,var(--c3),var(--c4))]" />
          <div className="flex justify-center mb-4">
            <div data-icon-wrapper="true" className="p-3 bg-(--c2) rounded-xl">
              <GitPullRequest className="w-8 h-8 text-(--c4d)" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-(--ink) tracking-[-0.8px] mb-2">
            Contribute to DevStudy
          </h3>
          <p className="text-(--muted) mb-6">
            Feel free to contribute to the project on GitHub. We are waiting for your pull requests!
          </p>
          <a 
            href="https://github.com/URAYUSHJAIN/Devstudy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-(--ink) text-(--c1) font-semibold rounded-xl gap-2 w-full sm:w-auto hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center text-(--muted) hover:text-(--ink) font-medium transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
