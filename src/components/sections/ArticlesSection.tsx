export default function ArticlesSection() {
  return (
    <div className="content-box">
      <h2 className="text-3xl mb-6 glow-text">ARTICLES</h2>
      
      <div className="space-y-4">
        <div className="border border-foreground p-4">
          <h3 className="text-xl mb-2">Troubleshooting TTYI Issues</h3>
          <p className="text-foreground/80">
            Deep dive into terminal interface debugging techniques
          </p>
        </div>
        
        <div className="border border-foreground p-4">
          <h3 className="text-xl mb-2">Creating Bootable Media</h3>
          <p className="text-foreground/80">
            Step-by-step guide to reliable boot drive creation
          </p>
        </div>
      </div>
    </div>
  );
}