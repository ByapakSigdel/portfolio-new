'use client';
import { motion } from 'framer-motion';
import AnimatedCard from '../ui/AnimatedCard';
import { projects } from '@/lib/data/projects';

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl font-bold text-center mb-12"
      >
        Featured Projects
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <AnimatedCard key={project.id} index={index}>
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-foreground/80 mt-2">{project.description}</p>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}