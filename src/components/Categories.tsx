import React from 'react';
import { Zap, Rocket, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 bg-(--c1) relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-(--c3)/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-(--c4)/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-(--c2)/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-(--ink) tracking-[-1.5px] mb-6">
            Not Just Another Course Platform.
          </h2>
          <p className="text-xl text-(--muted) max-w-3xl mx-auto leading-relaxed">
            We're building the operating system for your engineering career. 
            <span className="text-(--ink) font-semibold"> No fluff. No outdated tutorials.</span> Just pure, production-grade engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div data-interactive-card="true" className="group relative p-8 rounded-2xl bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]">
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
            <div className="relative h-full flex flex-col items-center text-center">
              <div data-icon-wrapper="true" className="w-11 h-11 bg-(--c2) rounded-xl flex items-center justify-center mb-6 group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
                <Zap className="w-6 h-6 text-(--c4d)" />
              </div>
              <h3 className="text-2xl font-bold text-(--ink) mb-4 tracking-[-1px]">Speed to Senior</h3>
              <p className="text-(--muted)">
                Skip the "Hello World" phase. Dive straight into distributed systems, microservices, and high-scale architecture.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div data-interactive-card="true" className="group relative p-8 rounded-2xl bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)] md:-translate-y-8">
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
            <div className="relative h-full flex flex-col items-center text-center">
              <div data-icon-wrapper="true" className="w-11 h-11 bg-(--c2) rounded-xl flex items-center justify-center mb-6 group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
                <Rocket className="w-6 h-6 text-(--c4d)" />
              </div>
              <h3 className="text-2xl font-bold text-(--ink) mb-4 tracking-[-1px]">Build Real Sh*t</h3>
              <p className="text-(--muted)">
                Don't just watch. Build a Spotify clone, a Zoom alternative, or a crypto exchange. Deploy it. Scale it. Own it.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <a 
            href="https://chat.whatsapp.com/Ghp3dbhDlsrF3HzEw72u1r"
            target="_blank"
            rel="noopener noreferrer" 
            data-interactive-card="true"
            className="group relative p-8 rounded-2xl bg-[rgba(255,255,255,0.72)] border border-[rgba(113,201,206,0.28)] hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)] block cursor-pointer"
          >
            <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
            <div className="relative h-full flex flex-col items-center text-center">
              <div data-icon-wrapper="true" className="w-11 h-11 bg-(--c2) rounded-xl flex items-center justify-center mb-6 group-hover:bg-(--c3) group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
                <Users className="w-6 h-6 text-(--c4d)" />
              </div>
              <h3 className="text-2xl font-bold text-(--ink) mb-4 tracking-[-1px]">Elite Community</h3>
              <p className="text-(--muted) mb-4">
                Join a network of engineers from Google, Meta, and top startups. Code reviews, mock interviews, and referrals.
              </p>
              <span className="text-(--c4d) text-sm font-semibold group-hover:underline">Join WhatsApp Group →</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
