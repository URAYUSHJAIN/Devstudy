'use client';

import React, { useState } from 'react';
import { Github, Search, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Courses', href: '/courses' },
    { name: 'Roadmaps', href: '/roadmaps' },
    { name: 'Labs', href: '/labs' },
    { name: 'System Design', href: '/system-design' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-(--c1)/90 backdrop-blur-md border-b border-(--c3)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-[-1px] text-(--ink) font-mono flex items-center gap-2">
              <div className="w-8 h-8 bg-(--ink) rounded-lg flex items-center justify-center text-(--c1)">
                &lt;/&gt;
              </div>
              DEVSTUDY
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive(item.href)
                    ? 'text-(--ink) bg-(--c2)'
                    : 'text-(--muted) hover:text-(--ink) hover:bg-(--c2)'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pl-10 text-sm rounded-full border border-(--c3) bg-(--c1) focus:outline-none focus:ring-2 focus:ring-(--c4) text-(--ink)"
                  autoFocus
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-(--muted) hover:text-(--ink) transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <a
              href="https://github.com/urayushjain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 text-(--muted) hover:text-(--ink) transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            {session ? (
              <Link
                href="/profile"
                aria-label="Profile"
                className="p-2 text-(--muted) hover:text-(--ink) transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="px-4 py-2 text-sm font-medium bg-(--ink) text-(--c1) rounded-lg hover:-translate-y-px"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 text-(--muted) hover:text-(--ink)"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-(--c1) border-b border-(--c3)">
          <div className="px-4 pt-4 pb-8 space-y-4 sm:px-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 rounded-lg text-base font-medium text-(--muted) hover:text-(--ink) hover:bg-(--c2)"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-4 border-t border-(--c3)">
              <div className="flex items-center mb-4">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-2 pl-10 text-sm rounded-lg border border-(--c3) bg-(--c1) focus:outline-none focus:ring-2 focus:ring-(--c4) text-(--ink)"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
                </form>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-lg text-base font-medium text-(--muted) hover:text-(--ink) hover:bg-(--c2)"
              >
                <Github className="w-5 h-5 mr-3" />
                GitHub
              </a>
              {session ? (
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 rounded-lg text-base font-medium text-(--muted) hover:text-(--ink) hover:bg-(--c2)"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Link>
              ) : (
                <button 
                  onClick={() => signIn('github')}
                  className="w-full text-left block px-4 py-2 rounded-lg text-base font-medium bg-(--ink) text-(--c1) hover:-translate-y-px"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
