'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Coding Labs</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Practice writing clean, efficient code in a distraction-free environment.
          </p>
        </div>
        
        <div className="h-[600px] mb-8 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-lg">
          <Editor 
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            defaultValue={`// Welcome to DevStudy Labs
// Write your JavaScript/TypeScript code here

function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
}

console.log(calculateFactorial(5));
`}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
            }}
          />
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Reference: JavaScript</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
            <div>
              <p className="font-bold mb-1">Array Methods</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
{`// Map
arr.map(x => x * 2)

// Filter
arr.filter(x => x > 5)

// Reduce
arr.reduce((acc, cur) => acc + cur, 0)`}
              </pre>
            </div>
            <div>
              <p className="font-bold mb-1">Async/Await</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
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
