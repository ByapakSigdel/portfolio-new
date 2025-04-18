'use client';
import React from 'react';

const ArticlesSection = () => {
  const articles = [
    {
      title: "Troubleshooting TTY Issues",
      description: "Deep dive into terminal interface debugging techniques"
    },
    {
      title: "Creating Bootable Media",
      description: "Step-by-step guide to reliable boot drive creation"
    },
    {
      title: "Network Security Protocols",
      description: "Understanding modern encryption standards"
    },
    {
      title: "File System Architecture",
      description: "Low-level exploration of storage systems"
    }
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {articles.map((article, index) => (
          <div key={index} className="flex items-center justify-between group hover:bg-green-900/10 p-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 opacity-60 flex items-center justify-center text-xs">
                {index + 1}.
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-400">{article.title}</h3>
                <p className="text-xs text-green-400 opacity-80 hidden md:block">{article.description}</p>
              </div>
            </div>
            <span className="text-green-400">➚</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArticlesSection;