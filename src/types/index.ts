export interface Skill {
  name: string;
  level: number;
  icon: string;
  category: 'mobile' | 'web' | 'tool';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'mobile' | 'web' | 'fullstack';
}

export interface SectionProps {
  id: string;
  className?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
  readTime?: string;
}

