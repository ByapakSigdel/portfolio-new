'use client';
import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/animations/variants';

export default function AnimatedCard({
  children,
  index
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      custom={index}
      className="p-6 bg-card rounded-lg shadow-lg"
    >
      {children}
    </motion.div>
  );
}