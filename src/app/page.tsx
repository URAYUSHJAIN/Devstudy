import Hero from '@/components/Hero';
import AboutSection from '@/components/Categories';
import EngineerPaths from '@/components/EngineerPaths';
import CoursesGrid from '@/components/CoursesGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-(--c1) selection:bg-(--c4)/30">
      <Hero />
      <AboutSection />
      <EngineerPaths />
      <CoursesGrid />
    </main>
  );
}
