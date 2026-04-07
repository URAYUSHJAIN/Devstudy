'use client';

import React from 'react';
import CodeEditor from '@/components/CodeEditor';

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-(--c1) pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--ink) tracking-[-1px] mb-2">Coding Labs</h1>
          <p className="text-(--muted)">
            Practice writing clean, efficient code in a distraction-free environment.
          </p>
        </div>
        
        <div data-interactive-card="true" className="h-125 lg:h-150 mb-8 shadow-[0_12px_32px_rgba(113,201,206,0.15)] rounded-2xl overflow-hidden border border-[rgba(113,201,206,0.28)]">
          <CodeEditor />
        </div>

        <div data-interactive-card="true" className="relative mt-8 p-6 bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-[linear-gradient(90deg,var(--c3),var(--c4))]" />
          <h3 className="text-lg font-semibold text-(--ink) mb-4 tracking-[-0.8px]">Quick Reference: JavaScript</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-(--muted) font-mono">
            <div>
              <p className="font-bold mb-2 text-(--ink2)">Array Methods</p>
              <pre className="bg-(--c2) border border-(--c3) p-4 rounded-xl text-(--ink2)">
{`// Map
arr.map(x => x * 2)

// Filter
arr.filter(x => x > 5)

// Reduce
arr.reduce((acc, cur) => acc + cur, 0)`}
              </pre>
            </div>
            <div>
              <p className="font-bold mb-2 text-(--ink2)">Async/Await</p>
              <pre className="bg-(--c2) border border-(--c3) p-4 rounded-xl text-(--ink2)">
{`async function fetchData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
  } catch (err) {
    console.error(err);
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
