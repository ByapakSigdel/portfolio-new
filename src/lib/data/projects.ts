export interface Project {
    id: number;
    title: string;
    description: string;
  }
  
  // Make sure this array exists and is exported
  export const projects: Project[] = [
    {
      id: 1,
      title: "TTY Issue Debugging",
      description: "Troubleshooting system-level terminal issues"
    },
    {
      id: 2,
      title: "Bootable Drive Creator",
      description: "Utility for creating bootable USB drives"
    },
    // Add at least 3 items for testing
    {
      id: 3,
      title: "Portfolio Website",
      description: "Personal portfolio with animations"
    }
  ];