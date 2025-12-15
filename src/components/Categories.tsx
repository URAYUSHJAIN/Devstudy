import React from 'react';
import { Zap, Rocket, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 mb-6 animate-gradient-x">
            Not Just Another Course Platform.
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We're building the operating system for your engineering career. 
            <span className="text-white font-semibold"> No fluff. No outdated tutorials.</span> Just pure, production-grade engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-indigo-500/50 hover:to-purple-500/50 transition-all duration-500">
            <div className="absolute inset-0 bg-slate-950 rounded-2xl m-[1px]" />
            <div className="relative p-8 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Speed to Senior</h3>
              <p className="text-slate-400">
                Skip the "Hello World" phase. Dive straight into distributed systems, microservices, and high-scale architecture.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-500 transform md:-translate-y-8">
            <div className="absolute inset-0 bg-slate-950 rounded-2xl m-[1px]" />
            <div className="relative p-8 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Real Sh*t</h3>
              <p className="text-slate-400">
                Don't just watch. Build a Spotify clone, a Zoom alternative, or a crypto exchange. Deploy it. Scale it. Own it.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <a 
            href="https://chat.whatsapp.com/Ghp3dbhDlsrF3HzEw72u1r"
            target="_blank"
            rel="noopener noreferrer" 
            className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 hover:from-emerald-500/50 hover:to-teal-500/50 transition-all duration-500 block cursor-pointer"
          >
            <div className="absolute inset-0 bg-slate-950 rounded-2xl m-[1px]" />
            <div className="relative p-8 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Elite Community</h3>
              <p className="text-slate-400 mb-4">
                Join a network of engineers from Google, Meta, and top startups. Code reviews, mock interviews, and referrals.
              </p>
              <span className="text-emerald-400 text-sm font-semibold group-hover:underline">Join WhatsApp Group →</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
