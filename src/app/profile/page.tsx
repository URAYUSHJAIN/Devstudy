import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPinnedRepos } from "@/lib/github";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github, Star, GitFork, BookOpen, Map } from "lucide-react";
import { roadmaps } from "@/data/roadmaps";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/api/auth/signin");
  }

  const pinnedRepos = await getUserPinnedRepos(session.accessToken);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
            {session.user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {session.user?.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {session.user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GitHub Showcase */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Showcase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedRepos.length > 0 ? (
                  pinnedRepos.map((repo: any) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {repo.name}
                        </h3>
                        <div className="flex items-center text-slate-500 text-sm">
                          <Star className="w-4 h-4 mr-1" />
                          {repo.stargazerCount}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                        {repo.description || "No description available"}
                      </p>
                      {repo.primaryLanguage && (
                        <div className="flex items-center text-xs text-slate-500">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: repo.primaryLanguage.color }}
                          />
                          {repo.primaryLanguage.name}
                        </div>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    <p className="text-slate-500">No pinned repositories found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DevStudy Progress */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Active Roadmaps
              </h2>
              <div className="space-y-4">
                {roadmaps.slice(0, 3).map((roadmap) => (
                  <Link
                    key={roadmap.id}
                    href={`/roadmaps/${roadmap.id}`}
                    className="block p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {roadmap.title}
                    </h3>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }} // Mock progress
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
