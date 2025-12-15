import AnnouncementBar from '@/components/AnnouncementBar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/Categories';
import EngineerPaths from '@/components/EngineerPaths';
import CoursesGrid from '@/components/CoursesGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 selection:bg-indigo-500/30">
      <AnnouncementBar />
      <Hero />
      <AboutSection />
      <EngineerPaths />
      <CoursesGrid />
    </main>
  );
}
