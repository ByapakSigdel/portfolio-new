'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-5xl font-bold text-foreground">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl text-foreground/80">
          Developer & Technical Writer
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-primary text-background rounded-lg"
        >
          View Work
        </motion.button>
      </motion.div>
    </section>
  );
}