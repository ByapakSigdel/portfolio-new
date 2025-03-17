import React from 'react';

const ArticlesSection = () => {
  return (
    <section className="section-container">
      <h2 className="section-header">ARTICLES</h2>
      <div className="article-item">
        <h3 className="item-title">Troubleshooting TTYI Issues</h3>
        <p className="item-description">Deep dive into terminal interface debugging techniques</p>
      </div>
      <div className="article-item">
        <h3 className="item-title">Creating Bootable Media</h3>
        <p className="item-description">Step-by-step guide to reliable boot drive creation</p>
      </div>
      {/* Add more articles as needed */}
    </section>
  );
};

export default ArticlesSection;