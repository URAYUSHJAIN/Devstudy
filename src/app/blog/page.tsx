import React from 'react';
import { getMediumPosts } from '@/lib/medium';
import { Calendar, ArrowUpRight } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getMediumPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Engineering Blog</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Thoughts on software engineering, system design, and career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <article 
                key={index} 
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group overflow-hidden flex flex-col"
              >
                {post.thumbnail && (
                  <div className="h-48 w-full overflow-hidden relative shrink-0">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
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
                      className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      {post.title}
                    </a>
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {post.contentSnippet}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Read on Medium
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2">
                        {post.categories.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
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
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                No posts found or unable to fetch feed. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
