import { Skill, Project, WorkExperience, BlogPost } from '@/types';

export const skills: Skill[] = [
  // Mobile Development
  { name: 'React Native', level: 90, icon: '📱', category: 'mobile' },
  { name: 'Flutter', level: 85, icon: '🎯', category: 'mobile' },
  { name: 'Android Development', level: 85, icon: '🤖', category: 'mobile' },
  
  // Web Development
  { name: 'React', level: 95, icon: '⚛️', category: 'web' },
  { name: 'TypeScript', level: 90, icon: '📘', category: 'web' },
  { name: 'Tailwind CSS', level: 90, icon: '🎨', category: 'web' },
  
  // Backend & Tools
  { name: 'Spring Boot', level: 85, icon: '☕', category: 'tool' },
  { name: 'MongoDB', level: 85, icon: '🍃', category: 'tool' },
  { name: 'Redux', level: 90, icon: '🔄', category: 'tool' },
  { name: 'Figma', level: 85, icon: '🎨', category: 'tool' },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Stupro',
    description: 'Co-Founder project. Built end-to-end mobile application UI using React Native and reusable component patterns. Developed backend REST APIs including Feedback, Verify OTP, and authentication workflows. Integrated Gemini AI API to generate dynamic content. Designed multi-step forms and documented APIs using Swagger.',
    technologies: ['React Native', 'TypeScript', 'Spring Boot', 'MongoDB', 'Figma'],
    category: 'mobile',
    githubUrl: 'https://github.com/MeenaSivakumar/stupro.git',
  },
  {
    id: '2',
    title: 'Weather App (Android)',
    description: 'Built an Android weather app providing real-time temperature, humidity, and forecast updates. Used GPS to fetch location-based weather results. Implemented network calls using Volley, parsed JSON responses, and displayed data using RecyclerView. Used Picasso for fast and optimized image loading.',
    technologies: ['Java', 'WeatherAPI', 'GPS', 'JSON', 'RecyclerView', 'Volley'],
    category: 'mobile',
    githubUrl: 'https://github.com/MeenaSivakumar/WeatherApp.git',
  },
  {
    id: '3',
    title: 'Instagram Clone',
    description: 'Replicated core Instagram functionalities including feed, comments, profile, and posts. Implemented Firebase Authentication for secure login/signup. Built real-time updates for posts and comments using Cloud Firestore. Used Firebase Storage for image uploads.',
    technologies: ['Flutter', 'Firebase Auth', 'Firestore', 'Cloud Storage'],
    category: 'mobile',
    githubUrl: 'https://github.com/MeenaSivakumar/instaclone.git',
  },
  {
    id: '4',
    title: 'Tour Guide App',
    description: 'Developed an application to explore tourist destinations with images and descriptions. Users can upload visited places, store insights locally, and manage content offline with Sqflite. Designed UI for listing, viewing, and sharing travel experiences.',
    technologies: ['Flutter', 'Sqflite'],
    category: 'mobile',
    githubUrl: 'https://github.com/MeenaSivakumar/Tour-Guide.git',
  },
];

export const socialLinks = {
  github: 'https://github.com/MeenaSivakumar',
  linkedin: 'https://linkedin.com/in/meena-sivakumar',
  email: 'mailto:meena@example.com',
  leetcode: 'https://leetcode.com/u/Meenasivakumar/',
};

export const workExperience: WorkExperience[] = [
  {
    id: '1',
    company: 'Techjays',
    position: 'Frontend Intern',
    duration: 'June – Present',
    location: 'Remote',
    description: [
      'Built responsive UIs for both mobile (React Native) and web apps (React + TypeScript)',
      'Developed reusable components, screens, navigation flows, and form validations',
      'Integrated APIs and improved data flow using Redux + TypeScript',
      'Implemented local storage with AsyncStorage for persistent user/session data',
      'Connected React Native with native modules to update Android/iOS widgets',
      'Implemented push notifications for real-time user engagement and updates',
      'Developed and integrated widget implementations for enhanced user experience',
      'Built voice-based navigation using AI for hands-free app interaction',
      'Worked closely with backend & design teams to deliver polished, production-ready UI'
    ],
    technologies: ['React Native', 'React', 'TypeScript', 'Tailwind', 'Redux'],
  },
  {
    id: '2',
    company: 'Stupro',
    position: 'Co-Founder',
    duration: '2024 – 2025',
    location: 'Remote',
    description: [
      'Built both the frontend and backend of the application',
      'Designed and implemented multi-step flows (sign-up, change password, feedback forms)',
      'Developed REST APIs for Feedback, Verify OTP, and secure user workflows',
      'Integrated Gemini AI API for dynamic data generation',
      'Documented all APIs using Swagger for smooth developer collaboration',
      'Created Figma prototypes for core screens and user experience design'
    ],
    technologies: ['React Native', 'TypeScript', 'Spring Boot', 'MongoDB'],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Evolving Through the Chapters of Life',
    description: 'A personal reflection on growth, learning, and the journey of self-discovery in life and career.',
    url: 'https://medium.com/@meenasad09/evolving-through-the-chapters-of-life-2496e0795daf',
    date: '2024-01-15',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Optimizing React Application Performance: A Beginner-Friendly Guide',
    description: 'Learn essential techniques and best practices to improve the performance of your React applications.',
    url: 'https://medium.com/@meenasad09/optimizing-react-application-performance-a-beginner-friendly-guide-089998271cd5',
    date: '2024-01-10',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'The Journey That Changed My Path',
    description: 'Sharing the transformative experiences that shaped my career and personal development journey.',
    url: 'https://medium.com/@meenasad09/the-journey-that-changed-my-path-f8a35bbde03b',
    date: '2024-01-05',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'A Beginner\'s Guide to Redux for State Management in React',
    description: 'A comprehensive guide to understanding and implementing Redux for managing state in React applications.',
    url: 'https://medium.com/@meenasad09/a-beginners-guide-to-redux-for-state-management-in-react-8d91eda7a1fb',
    date: '2023-12-20',
    readTime: '10 min read',
  },
  {
    id: '5',
    title: 'From Small Cuts to Big Wins: How Stupro is the Game-Changer for Students',
    description: 'Exploring how Stupro is revolutionizing the student experience and helping students achieve their goals.',
    url: 'https://medium.com/@meenasad09/from-small-cuts-to-big-wins-how-stupro-is-the-game-changer-for-students-b013bb4ae318',
    date: '2023-12-15',
    readTime: '7 min read',
  },
  {
    id: '6',
    title: 'The Hidden Talents That Lack Guidance and the App That Can Change Their Journey',
    description: 'Discussing how technology can help discover and nurture hidden talents in students and individuals.',
    url: 'https://medium.com/@meenasad09/the-hidden-talents-that-lack-guidance-and-the-app-that-can-change-their-journey-4a048d7d4131',
    date: '2023-12-10',
    readTime: '6 min read',
  },
  {
    id: '7',
    title: 'The Art of Writing Email: Learned from My Mentor',
    description: 'Valuable lessons and best practices for writing effective professional emails, learned from mentorship experiences.',
    url: 'https://medium.com/@meenasad09/the-art-of-writing-email-learned-from-my-mentor-3b604c53617a',
    date: '2023-12-05',
    readTime: '5 min read',
  },
];

