import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ArticlesSection from '@/components/sections/ArticlesSection';
import GraphsSection from '@/components/sections/GraphsSection';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <ProjectsSection />
      <ArticlesSection />
      <GraphsSection />
    </MainLayout>
  );
}