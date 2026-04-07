import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { getMediumPosts } from '@/lib/medium';

export const revalidate = 3600;

const CoursesGrid = async () => {
  const posts = await getMediumPosts();
  const featured = posts.slice(0, 4);

  return (
    <section className="py-20 bg-(--c1)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-(--ink) tracking-[-1px] mb-2">
              Featured Engineering Blogs
            </h2>
            <p className="text-(--muted)">
              Latest write-ups on system design, backend architecture, and engineering growth.
            </p>
          </div>
          <Link href="/blog" className="text-(--c4d) font-medium hover:underline hidden sm:block">
            View all blogs
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {featured.length > 0 ? (
            featured.map((post, idx) => {
              const rawSnippet = (post.contentSnippet || '').trim();
              const normalizedTitle = post.title.trim().toLowerCase();
              const normalizedSnippet = rawSnippet.toLowerCase();
              const snippet = rawSnippet && normalizedSnippet !== normalizedTitle
                ? rawSnippet
                : 'Read the full post on Medium.';

              return (
                <article
                  data-interactive-card="true"
                  key={`${post.link}-${idx}`}
                  className="relative self-start block bg-[rgba(255,255,255,0.78)] rounded-lg border border-[rgba(113,201,206,0.32)] overflow-hidden group hover:border-(--c4) hover:-translate-y-0.75 hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]"
                >
                  <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
                  <div className="h-44 relative overflow-hidden">
                    {post.thumbnail ? (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block" aria-label={`Open ${post.title}`}>
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.52))]" />
                      </a>
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--c2),var(--c3))]" />
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-(--muted)">
                      <div className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.pubDate ? new Date(post.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Latest'}</span>
                      </div>
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-(--c4d) hover:text-(--ink)">
                        Read
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <h3 className="text-lg leading-[1.35] font-bold text-(--ink) line-clamp-3 group-hover:text-(--c4d) transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-(--muted) line-clamp-3">
                      {snippet}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="sm:col-span-2 rounded-lg border border-[rgba(113,201,206,0.32)] bg-white/70 p-6 text-center text-(--muted)">
              Unable to load blogs right now. Check the full blog page for updates.
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog" className="text-(--c4d) font-medium hover:underline">
            View all blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesGrid;
