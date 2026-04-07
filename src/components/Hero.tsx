import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Code2, Cpu, Globe, Database } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-28 md:pt-32 pb-24 md:pb-28 overflow-hidden bg-[linear-gradient(160deg,var(--c1),#f0fefe_40%,var(--c2))]">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-36 bg-[radial-gradient(55%_90%_at_50%_0%,rgba(113,201,206,0.25),rgba(113,201,206,0))]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--c2) border border-(--c3) mb-7 shadow-[0_8px_18px_rgba(113,201,206,0.18)]">
              <span className="w-2 h-2 rounded-full bg-(--c4) animate-pulse-dot" />
              <span className="text-xs font-semibold text-(--ink) uppercase tracking-[0.06em]">
                Trusted by 100K+ Engineers
              </span>
            </div>
            
            <h1 className="text-[40px] sm:text-[46px] lg:text-[54px] font-bold text-(--ink) tracking-[-1.8px] mb-6 leading-[1.04]">
              Build Real-World <br className="hidden lg:block" />
              <span className="text-(--c4d)">Engineering Skills</span> <br className="hidden lg:block" />
              That Actually Ship
            </h1>
            
            <p className="text-[16px] sm:text-[17px] text-(--muted) mb-9 max-w-2xl mx-auto lg:mx-0 leading-[1.7]">
              Project-driven courses, system design, and AI-assisted learning for developers. 
              Stop watching tutorials. Start shipping code.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/labs" className="w-full sm:w-auto px-8 py-4 bg-(--ink) text-(--c1) font-semibold rounded-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(.34,1.56,.64,1)] shadow-[0_8px_20px_rgba(13,43,44,0.12)]">
                Start Coding
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/roadmaps" className="w-full sm:w-auto px-8 py-4 border-[1.5px] border-(--c3) hover:bg-(--c2) text-(--ink) font-semibold rounded-xl transition-colors flex items-center justify-center">
                View Roadmaps
              </Link>
            </div>

            <div className="mt-9 pt-5 border-t border-(--c3) grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              <div>
                <p className="text-[28px] font-bold text-(--ink) tracking-[-1px]">100K+</p>
                <p className="text-[12px] uppercase tracking-[0.06em] text-(--muted)">Engineers</p>
              </div>
              <div>
                <p className="text-[28px] font-bold text-(--ink) tracking-[-1px]">120+</p>
                <p className="text-[12px] uppercase tracking-[0.06em] text-(--muted)">Projects</p>
              </div>
              <div>
                <p className="text-[28px] font-bold text-(--ink) tracking-[-1px]">24/7</p>
                <p className="text-[12px] uppercase tracking-[0.06em] text-(--muted)">Lab Access</p>
              </div>
            </div>
          </div>

          {/* Right Content - Code Editor Mockup */}
          <div className="lg:col-span-6 mt-14 lg:mt-2 relative animate-float">
            {/* Floating Stat Card */}
            <div className="absolute -top-9 -right-3 z-10 bg-white/80 p-4 rounded-xl shadow-xl border border-(--c3) hidden md:block animate-fade-in-up backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-(--c2) rounded-full">
                  <Terminal className="w-5 h-5 text-(--c4d)" />
                </div>
                <div>
                  <p className="text-xs text-(--muted) font-medium">Active Engineers</p>
                  <p className="text-lg font-bold text-(--ink)">100,000+</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl bg-(--ink) shadow-2xl border border-(--c4d) overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center px-4 py-3 bg-[#12393b] border-b border-(--c4d)">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-(--c3) font-mono">server.ts</div>
              </div>
              
              {/* Editor Content */}
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code className="text-[#cbeef1]">
                    <span className="text-[#8ad9de]">import</span> {'{'} NextApiRequest, NextApiResponse {'}'} <span className="text-[#8ad9de]">from</span> <span className="text-[#9df0cf]">'next'</span>;<br/>
                    <br/>
                    <span className="text-[#8ad9de]">export default async function</span> <span className="text-[#78c9ff]">handler</span>(<br/>
                    &nbsp;&nbsp;req: <span className="text-[#f5da97]">NextApiRequest</span>,<br/>
                    &nbsp;&nbsp;res: <span className="text-[#f5da97]">NextApiResponse</span><br/>
                    ) {'{'}<br/>
                    &nbsp;&nbsp;<span className="text-[#8ad9de]">const</span> {'{'} method {'}'} = req;<br/>
                    <br/>
                    &nbsp;&nbsp;<span className="text-[#8ad9de]">switch</span> (method) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8ad9de]">case</span> <span className="text-[#9df0cf]">'GET'</span>:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#6fa8ac]">// Fetch engineering data</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-[#78c9ff]">status</span>(200).<span className="text-[#78c9ff]">json</span>({'{'} message: <span className="text-[#9df0cf]">'Hello Dev!'</span> {'}'});<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8ad9de]">break</span>;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8ad9de]">default</span>:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-[#78c9ff]">setHeader</span>(<span className="text-[#9df0cf]">'Allow'</span>, [<span className="text-[#9df0cf]">'GET'</span>]);<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="text-[#78c9ff]">status</span>(405).<span className="text-[#78c9ff]">end</span>(<span className="text-[#9df0cf]">`Method ${'{'}method{'}'} Not Allowed`</span>);<br/>
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
