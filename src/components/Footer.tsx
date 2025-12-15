import React from 'react';
import { Github, Twitter, Linkedin, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">DEVSTUDY</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
              The premier learning platform for professional software engineers. 
              Master the skills that matter in production.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/urayushjain" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/urayushjain" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/urayushjain" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Courses</a></li>
              <li><a href="/roadmaps" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Roadmaps</a></li>
              <li><a href="/labs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Labs</a></li>
              <li><a href="/system-design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">System Design</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="/cheatsheets" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cheatsheets</a></li>
              <li><a href="/community" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</a></li>
              <li><a href="/success-stories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} DevStudy Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
