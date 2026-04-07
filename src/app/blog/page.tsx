import React from 'react';
import { getMediumPosts } from '@/lib/medium';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getMediumPosts();

  return (
    <div className="min-h-screen bg-(--c1) pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--ink) tracking-[-1px] mb-2">Engineering Blog</h1>
          <p className="text-(--muted)">
            Thoughts on software engineering, system design, and career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <article 
                data-interactive-card="true"
                key={index} 
                className="relative bg-[rgba(255,255,255,0.72)] rounded-2xl border border-[rgba(113,201,206,0.28)] hover:border-(--c4) group hover:-translate-y-0.75 overflow-hidden flex flex-col hover:shadow-[0_12px_32px_rgba(113,201,206,0.15)]"
              >
                <div className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-[linear-gradient(90deg,var(--c3),var(--c4))] transition-transform duration-300" />
                {post.thumbnail && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" title={post.title} aria-label={`Open ${post.title}`} className="h-48 w-full overflow-hidden relative shrink-0 block">
                    <Image
                      src={post.thumbnail} 
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                    />
                  </a>
                )}
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center text-sm text-(--muted)">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <a
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-(--c4) group-hover:text-(--c4d) transition-colors z-10"
                      aria-label="Open article"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <h2 className="text-xl font-bold text-(--ink) mb-3 group-hover:text-(--c4d) transition-colors tracking-[-0.8px]">
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                      {post.title}
                    </a>
                  </h2>
                  
                  <p className="text-(--muted) mb-4 line-clamp-3">
                    {post.contentSnippet}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-(--c4d) hover:text-(--ink) transition-colors z-10"
                    >
                      Read on Medium
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap justify-end gap-2 max-w-full">
                        {post.categories.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-3 py-1 bg-(--c2) border border-(--c3) rounded-full text-(--muted) whitespace-nowrap max-w-32 overflow-hidden text-ellipsis">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12 bg-[rgba(255,255,255,0.72)] rounded-2xl border border-[rgba(113,201,206,0.28)]">
              <p className="text-(--muted)">
                No posts found or unable to fetch feed. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
