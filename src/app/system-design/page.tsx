import React from 'react';
import MermaidEditor from '@/components/MermaidEditor';

export default function SystemDesignPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">System Design Playground</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize your system architecture using Mermaid.js syntax.
          </p>
        </div>
        
        <MermaidEditor />
        
        <div className="mt-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Design Demo</h3>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
             <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/i53Gi_K3o7I?rel=0&modestbranding=1" 
                title="System Design Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
            <div>
              <p className="font-bold mb-1">Class Diagram</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
{`classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal : +int age
  Animal : +String gender
  Animal: +isMammal()
  Animal: +mate()`}
              </pre>
            </div>
            <div>
              <p className="font-bold mb-1">Sequence Diagram</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
{`sequenceDiagram
  Alice->>John: Hello John, how are you?
  John-->>Alice: Great!
  Alice-)John: See you later!`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
