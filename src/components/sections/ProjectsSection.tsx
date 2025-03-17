import React from 'react';

const ProjectsSection = () => {
  return (
    <section className="section-container">
      <h2 className="section-header">PROJECTS</h2>
      <div className="project-item">
        <h3 className="item-title">TTY Issue Debugger</h3>
        <p className="item-description">Advanced terminal troubleshooting toolkit</p>
      </div>
      <div className="project-item">
        <h3 className="item-title">Boot Drive Creator</h3>
        <p className="item-description">Low-level USB boot media generator</p>
      </div>
      {/* Add more projects as needed */}
    </section>
  );
};

export default ProjectsSection;