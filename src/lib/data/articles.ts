export interface Article {
    id: number;
    title: string;
    excerpt: string;
  }
  
  export const articles = [
    {
      id: 1,
      title: "Troubleshooting TTY Issues and Creating Bootable Drives",
      excerpt: "A comprehensive guide to diagnosing terminal-related problems and creating reliable bootable media for system recovery and installation."
    },
    {
      id: 2,
      title: "Advanced Filesystem Debugging Techniques",
      excerpt: "Exploring low-level filesystem diagnostics and recovery methods for enterprise environments."
    }
  ];