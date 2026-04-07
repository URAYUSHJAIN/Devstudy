import React from 'react';
import { Github, Twitter, Linkedin, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-(--c1) border-t border-[rgba(113,201,206,0.28)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="w-6 h-6 text-(--c4d)" />
              <span className="text-xl font-bold text-(--ink) font-mono">DEVSTUDY</span>
            </div>
            <p className="text-(--muted) text-sm mb-6 max-w-xs">
              The premier learning platform for professional software engineers. 
              Master the skills that matter in production.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/urayushjain" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-(--muted) hover:text-(--ink) transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/urayushjain" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-(--muted) hover:text-(--ink) transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/urayushjain" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-(--muted) hover:text-(--ink) transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.06em] text-(--ink) mb-4">Platform</h4>
            <ul className="space-y-2 text-[13px] text-(--muted)">
              <li><a href="/courses" className="hover:text-(--ink) transition-colors duration-150">Courses</a></li>
              <li><a href="/roadmaps" className="hover:text-(--ink) transition-colors duration-150">Roadmaps</a></li>
              <li><a href="/labs" className="hover:text-(--ink) transition-colors duration-150">Labs</a></li>
              <li><a href="/system-design" className="hover:text-(--ink) transition-colors duration-150">System Design</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.06em] text-(--ink) mb-4">Resources</h4>
            <ul className="space-y-2 text-[13px] text-(--muted)">
              <li><a href="/blog" className="hover:text-(--ink) transition-colors duration-150">Blog</a></li>
              <li><a href="/cheatsheets" className="hover:text-(--ink) transition-colors duration-150">Cheatsheets</a></li>
              <li><a href="/community" className="hover:text-(--ink) transition-colors duration-150">Community</a></li>
              <li><a href="/success-stories" className="hover:text-(--ink) transition-colors duration-150">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.06em] text-(--ink) mb-4">Company</h4>
            <ul className="space-y-2 text-[13px] text-(--muted)">
              <li><a href="/about" className="hover:text-(--ink) transition-colors duration-150">About</a></li>
              <li><a href="/careers" className="hover:text-(--ink) transition-colors duration-150">Careers</a></li>
              <li><a href="/privacy" className="hover:text-(--ink) transition-colors duration-150">Privacy</a></li>
              <li><a href="/terms" className="hover:text-(--ink) transition-colors duration-150">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[rgba(113,201,206,0.28)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-(--muted) text-sm">
            © {new Date().getFullYear()} DevStudy Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 px-3 py-2 rounded-full bg-(--c2) border border-(--c3)">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[11px] text-(--ink2)">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
