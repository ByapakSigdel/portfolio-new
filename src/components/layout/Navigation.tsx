'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between p-6">
        <Link href="/" className="text-xl font-bold text-primary">
          Portfolio
        </Link>
        <div className="flex space-x-8">
          {['Projects', 'Articles', 'Graphs'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ scale: 1.05 }}
              className="text-foreground/80 hover:text-primary"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}