export default function ProjectsSection() {
  return (
    <div className="content-box">
      <h2 className="text-3xl mb-6 glow-text">PROJECTS</h2>
      
      <div className="space-y-4">
        <div className="border-l-4 border-foreground pl-4">
          <h3 className="text-xl">TTY Issue Debugger</h3>
          <p className="text-foreground/80">Advanced terminal troubleshooting toolkit</p>
        </div>
        
        <div className="border-l-4 border-foreground pl-4">
          <h3 className="text-xl">Boot Drive Creator</h3>
          <p className="text-foreground/80">Low-level USB boot media generator</p>
        </div>
      </div>
    </div>
  );
}