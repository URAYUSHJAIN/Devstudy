import React from 'react';
import ProgressDashboard from '@/components/ProgressDashboard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-(--c1) pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-[-1px] text-(--ink) mb-2">Progress Dashboard</h1>
          <p className="text-(--muted)">Track battles, streaks, skills, and learning consistency over time.</p>
        </div>
        <ProgressDashboard />
      </div>
    </main>
  );
}
