import React from 'react';
import MermaidEditor from '@/components/MermaidEditor';

export default function SystemDesignPage() {
  return (
    <div className="min-h-screen bg-(--c1) pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-(--ink) tracking-[-1.5px] mb-4">System Design Playground</h1>
          <p className="text-lg text-(--muted)">
            Visualize your system architecture using Mermaid.js syntax.
          </p>
        </div>

        <div data-interactive-card="true" className="relative p-4 sm:p-6 bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-[linear-gradient(90deg,var(--c3),var(--c4))]" />
          <MermaidEditor />
        </div>
        
        <div data-interactive-card="true" className="relative mt-8 p-6 bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-[linear-gradient(90deg,var(--c3),var(--c4))]" />
          <h3 className="text-lg font-semibold text-(--ink) tracking-[-0.8px] mb-4">System Design Demo</h3>
          <div className="aspect-video w-full bg-(--ink) border border-(--c3) rounded-xl overflow-hidden">
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

        <div data-interactive-card="true" className="relative mt-8 p-6 bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] rounded-2xl">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-[linear-gradient(90deg,var(--c3),var(--c4))]" />
          <h3 className="text-lg font-semibold text-(--ink) tracking-[-0.8px] mb-4">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-(--muted) font-mono">
            <div>
              <p className="font-bold mb-2 text-(--ink2)">Class Diagram</p>
              <pre className="bg-(--c2) border border-(--c3) p-4 rounded-xl text-(--ink2)">
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
              <p className="font-bold mb-2 text-(--ink2)">Sequence Diagram</p>
              <pre className="bg-(--c2) border border-(--c3) p-4 rounded-xl text-(--ink2)">
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
