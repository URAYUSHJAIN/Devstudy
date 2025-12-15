import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Code2, Cpu, Globe, Database } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-white dark:bg-slate-950 pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Trusted by 100K+ Engineers
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Build Real-World <br className="hidden lg:block" />
              <span className="text-indigo-600 dark:text-indigo-400">Engineering Skills</span> <br className="hidden lg:block" />
              That Actually Ship
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Project-driven courses, system design, and AI-assisted learning for developers. 
              Stop watching tutorials. Start shipping code.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/labs" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                Start Coding
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/roadmaps" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 font-semibold rounded-lg transition-all flex items-center justify-center">
                View Roadmaps
              </Link>
            </div>
          </div>

          {/* Right Content - Code Editor Mockup */}
          <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
            {/* Floating Stat Card */}
            <div className="absolute -top-12 -right-4 z-10 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 hidden md:block animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Engineers</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">100,000+</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-slate-400 font-mono">server.ts</div>
              </div>
              
              {/* Editor Content */}
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code className="text-slate-300">
                    <span className="text-purple-400">import</span> {'{'} NextApiRequest, NextApiResponse {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'next'</span>;<br/>
                    <br/>
                    <span className="text-purple-400">export default async function</span> <span className="text-blue-400">handler</span>(<br/>
                    &nbsp;&nbsp;req: <span className="text-yellow-400">NextApiRequest</span>,<br/>
                    &nbsp;&nbsp;res: <span className="text-yellow-400">NextApiResponse</span><br/>
                    ) {'{'}<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">const</span> {'{'} method {'}'} = req;<br/>
                    <br/>
                    &nbsp;&nbsp;<span className="text-purple-400">switch</span> (method) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">case</span> <span className="text-green-400">'GET'</span>:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Fetch engineering data</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-blue-400">status</span>(200).<span className="text-blue-400">json</span>({'{'} message: <span className="text-green-400">'Hello Dev!'</span> {'}'});<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">break</span>;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">default</span>:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-blue-400">setHeader</span>(<span className="text-green-400">'Allow'</span>, [<span className="text-green-400">'GET'</span>]);<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-blue-400">status</span>(405).<span className="text-blue-400">end</span>(<span className="text-green-400">`Method ${'{'}method{'}'} Not Allowed`</span>);<br/>
                    &nbsp;&nbsp;{'}'}<br/>
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
