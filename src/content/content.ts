/**
 * ALL visitor-facing copy lives here.
 *
 * Sources: Meena_Resume.pdf, the previous portfolio (meena-portfolio-site-19.vercel.app)
 * and public GitHub repositories (github.com/MeenaSivakumar). Nothing here is invented;
 * where no source existed the field is left out or still marked [bracketed].
 *
 * Images: any `image` field accepts a URL (e.g. '/screens/stupro-1.png' in /public).
 * While it is undefined, a labelled wireframe is rendered instead.
 */

export interface DeviceStep {
  kicker: string;
  title: string;
  body: string;
  screenLabel: string;
  image?: string;
  /** Laptop steps: a small source file shown in the editor on the laptop screen */
  code?: { file: string; source: string };
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  role?: string;
  year: string;
  liveUrl?: string;
  codeUrl?: string;
  storeUrl?: string;
  image?: string;
  /** Featured project only */
  tagline?: string;
  highlights?: string[];
}

export interface Achievement {
  /** Milestone label shown in the card's eyebrow, e.g. 'The First Curiosity' */
  label: string;
  /** Only verified dates; omitted where none is known */
  date?: string;
  title: string;
  body: string[];
  /** Self-learning, internship, employment… shown in the card's chip */
  category: string;
}

export interface Article {
  topic: 'React' | 'Career' | 'Stupro';
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  publisher: string;
  href: string;
  image?: string;
}

export interface Stat {
  value: string;
  label: string;
}

const LINKS = {
  github: 'https://github.com/MeenaSivakumar',
  linkedin: 'https://www.linkedin.com/in/meena-34-b59912268/',
  leetcode: 'https://leetcode.com/u/Meenasivakumar/',
  medium: 'https://medium.com/@meenasad09',
};

/**
 * The stack, in one place. The laptop's code files (Web chapter) and the Toolkit section
 * both read from this — update it here and both stay in sync.
 */
const TOOLKIT = {
  core: ['React', 'TypeScript', 'JavaScript', 'React Native', 'PostgreSQL'],
  additional: ['MongoDB', 'Redux', 'Jotai', 'TanStack Query', 'Tailwind CSS', 'Firebase', 'AWS'],
  tools: ['Android', 'Flutter', 'Docker', 'Jenkins', 'GitHub Actions', 'SonarQube', 'Postman', 'Swagger', 'Figma'],
  practices: [
    'Component-based development',
    'Reusable architecture',
    'RESTful communication',
    'State management',
    'Debugging and troubleshooting',
    'Version control',
    'Agile development',
    'Design-to-development workflows',
    'Cross-platform development',
    'Full-stack feature development',
  ],
};

/**
 * How the Toolkit page groups the stack. Anything in TOOLKIT that isn't listed here
 * lands in 'tools', so adding a technology above never makes it disappear.
 */
const TOOLKIT_GROUPS = [
  { id: 'languages', label: 'languages' },
  { id: 'mobile', label: 'mobile' },
  { id: 'web', label: 'web' },
  { id: 'tools', label: 'tools' },
] as const;

const TOOLKIT_CATEGORY: Record<string, (typeof TOOLKIT_GROUPS)[number]['id']> = {
  TypeScript: 'languages',
  JavaScript: 'languages',
  'React Native': 'mobile',
  Flutter: 'mobile',
  Android: 'mobile',
  React: 'web',
  Redux: 'web',
  Jotai: 'web',
  'TanStack Query': 'web',
  'Tailwind CSS': 'web',
  PostgreSQL: 'web',
  MongoDB: 'web',
  Firebase: 'tools',
};

const ALL_TOOLS = [...TOOLKIT.core, ...TOOLKIT.additional, ...TOOLKIT.tools];

/** Renders a list as a small TS array for the laptop editor — one item per line, or packed to fit the screen. */
function tsArray(comment: string, name: string, items: string[], packed = false) {
  const quoted = items.map((t) => `'${t}'`);
  const lines: string[] = [];
  if (!packed) quoted.forEach((q) => lines.push(`  ${q},`));
  else {
    let line = '';
    for (const q of quoted) {
      const next = line ? `${line} ${q},` : `${q},`;
      if (next.length > 46 && line) {
        lines.push(`  ${line}`);
        line = `${q},`;
      } else line = next;
    }
    if (line) lines.push(`  ${line}`);
  }
  return `// ${comment}\nexport const ${name} = [\n${lines.join('\n')}\n];`;
}

export const content = {
  person: {
    name: 'Meena Sivakumar',
    monogram: 'MS',
    role: 'Full Stack Developer',
    /** Opening line, set as the book's epigraph on the first page */
    /** The opening page slowly cycles through these after the first epigraph */
    epigraphs: [
      'Every great creation begins with curiosity.',
      'Every page I turn teaches me a different way to see what hasn’t been built yet.',
      'I am drawn to the space between what is imagined and what is possible.',
      'Curiosity gives an idea its first shape; creation gives it somewhere to belong.',
    ],
    intro: 'A developer driven by curiosity, building one idea at a time.',
    introSupport: [
      'I enjoy exploring how technology works, understanding the problems people face, and turning ideas into digital experiences.',
      'From mobile applications to web platforms and backend systems, my journey has always been guided by one thing: the joy of creating.',
    ],
    /** Short facts printed under the intro */
    meta: ['Software Engineer · Sukiran Solutions', 'B.E. Computer Science & Engineering, 2025'],
    coverSubtitle: 'Full Stack Developer',
    location: 'Dindigul, Tamil Nadu, India',
  },

  mobile: {
    chapterTitle: 'Where the curiosity began',
    lead: 'Mobile applications were my first introduction to software development.',
    epigraph: 'Each technology introduced me to a new possibility; each challenge introduced me to a new version of myself.',
    steps: [
      {
        kicker: '01',
        title: 'Something in someone’s hands',
        body: 'I was fascinated that code could become an app people carry every day. That curiosity led me to Java for Android, and a weather app.',
        screenLabel: 'Weather App',
        image: '/art/weather-screen.svg',
      },
      {
        kicker: '02',
        title: 'Learning by experimenting',
        body: 'I kept exploring through courses, YouTube tutorials and small experiments. A Flutter workshop led to apps like an Instagram clone, and an internship where I built Journey Jot, a tour-guide app.',
        screenLabel: 'Journey Jot',
        image: '/art/journeyjot-screen.svg',
      },
      {
        kicker: '03',
        title: 'Behind the screen',
        body: 'React Native brought my first product, Stupro, then a mobile app at Techjays. What started as an interest in mobile applications became an interest in understanding the technology behind them.',
        screenLabel: 'Stupro',
        image: '/art/stupro-screen.svg',
      },
    ] as DeviceStep[],
  },

  transform: {
    caption: 'I began by learning how screens work. Somewhere along the way, I became curious about everything happening behind them.',
    note: 'React Native led to React — JavaScript and TypeScript in the browser.',
  },

  web: {
    chapterTitle: 'A wider canvas to create',
    lead: 'As I explored software development, my curiosity extended beyond mobile applications.',
    epigraph: 'I am interested in the invisible decisions that make visible experiences feel effortless.',
    steps: [
      {
        kicker: '01',
        title: 'Thinking in components',
        body: 'Learning JavaScript and React introduced me to a different way of thinking about interfaces, behaviour and reusable components. At Techjays, React and TypeScript expanded my understanding of frontend engineering.',
        screenLabel: 'Internal web app',
        code: {
          file: 'stack.ts',
          source: tsArray('Core professional stack', 'core', TOOLKIT.core),
        },
      },
      {
        kicker: '02',
        title: 'How the pieces fit together',
        body: 'Exploring backend development helped me understand how different parts of an application work together — now part of my everyday work with React, Node.js, Django and PostgreSQL at Sukiran Solutions.',
        screenLabel: 'Sukiran Solutions',
        code: {
          file: 'toolkit.ts',
          source: `${tsArray('Additional technologies', 'additional', TOOLKIT.additional, true)}\n\n${tsArray('Platform and engineering tools', 'tools', TOOLKIT.tools, true)}`,
        },
      },
      {
        kicker: '03',
        title: 'From interface to system',
        body: 'Today, I enjoy working across mobile and web platforms, understanding the complete journey from an interface to the systems supporting it — and I keep building and writing on my own.',
        screenLabel: 'My own web work',
        code: {
          file: 'practices.ts',
          source: tsArray('Engineering practices', 'practices', TOOLKIT.practices),
        },
      },
    ] as DeviceStep[],
  },

  projectsTitle: 'Ideas are where the work begins.',
  projectsLead: [
    'Every project has given me an opportunity to explore something new, work through challenges and understand how software behaves beyond the code editor.',
    'Some began as learning experiments. Others introduced me to real product requirements, integrations and application development in professional environments.',
    'I see every project as another opportunity to turn understanding into something tangible.',
  ],
  projectsEpigraph: 'A working solution answers the problem. A thoughtful solution understands why the problem existed.',

  projects: [
    {
      id: 'stupro',
      title: 'Stupro',
      summary:
        'A learning app that helps students become industry-ready through daily challenges, byte-sized lessons, writing feedback and leaderboards. I built the React Native app and Spring Boot APIs for OTP verification, authentication and feedback, and integrated Gemini AI for personalised content. It was my first experience of building a product rather than a learning app.',
      tags: ['React Native', 'TypeScript', 'Spring Boot', 'MongoDB', 'Gemini AI', 'Figma'],
      role: 'Co-Founder',
      year: 'Nov 2024 – Present',
      liveUrl: 'https://stupro.mentorbridge.in/',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.stupro',
      codeUrl: 'https://github.com/MeenaSivakumar/stupro',
      image: '/art/stupro.svg',
      tagline: 'From student to professional — faster, smarter, better.',
      highlights: ['Daily Career Challenges', 'Byte-sized AI learning cards', 'AI feedback on writing', 'Cross-college leaderboards'],
    },
    {
      id: 'weather-app',
      title: 'Weather App (Android)',
      summary:
        'My first Android app, in Java: live and hourly forecasts for any city. APIs made me enjoy Java itself.',
      tags: ['Java', 'Android', 'WeatherAPI', 'Volley'],
      year: '2024',
      codeUrl: 'https://github.com/MeenaSivakumar/WeatherApp',
      image: '/art/weather.svg',
    },
    {
      id: 'instaclone',
      title: 'Instagram Clone',
      summary:
        'Built to learn Flutter after a workshop: feeds, likes and follows, with Firebase for real-time data.',
      tags: ['Flutter', 'Firebase Auth', 'Firestore', 'Cloud Storage'],
      year: '2024',
      codeUrl: 'https://github.com/MeenaSivakumar/instaclone',
      image: '/art/instaclone.svg',
    },
    {
      id: 'tour-guide',
      title: 'Journey Jot — Tour Guide',
      summary:
        'A learning project from my Flutter internship: city picks, maps, a wishlist and offline places.',
      tags: ['Flutter', 'Sqflite', 'flutter_map'],
      year: '2025',
      codeUrl: 'https://github.com/MeenaSivakumar/Tour-Guide',
      image: '/art/journeyjot.svg',
    },
  ] as Project[],

  achievementsTitle: 'My Journey',
  achievementsLead: '',
  achievementsEpigraph: 'Every step started with a question. Every experience gave me a reason to ask another.',

  stats: [
    { value: '30+', label: 'Reusable UI components in Stupro’s shared design system' },
    { value: '~95%', label: 'In-app alert delivery after adding push notifications' },
    { value: '~25%', label: 'Less user-reported friction on the Techjays web app' },
  ] as Stat[],

  achievements: [
    {
      label: 'The First Curiosity',
      title: 'Discovering Mobile Application Development',
      body: [
        'Mobile applications caught my attention and introduced me to the possibilities of software development.',
        'I started exploring programming through Great Learning courses and YouTube tutorials, learning the fundamentals and experimenting with small applications.',
      ],
      category: 'Self-learning',
    },
    {
      label: 'Learning Through Practice',
      title: 'NSIC Internship',
      body: [
        'My internship at NSIC gave me an opportunity to strengthen my foundations through practical exercises and structured learning.',
        'Around this time, I started exploring Java for Android development and built a small weather application.',
        'Interestingly, I began enjoying Java itself, not just the applications I could build with it.',
      ],
      category: 'Internship',
    },
    {
      label: 'Exploring Flutter',
      title: 'Flutter Workshop and Internship',
      body: [
        'A Flutter workshop introduced me to another approach to mobile development.',
        'I started experimenting with Flutter, building small applications and exploring its capabilities.',
        'During my Flutter development internship, I worked on a Tour Guide application as a learning project, gaining more familiarity with application development.',
      ],
      category: 'Workshop · Internship',
    },
    {
      label: 'Understanding the Fundamentals',
      title: 'Data Structures and Algorithms with Java',
      body: [
        'As I explored development, I realised that knowing how to build applications was only one part of becoming an engineer.',
        'I began studying Data Structures and Algorithms using Java, solving problems independently and practising on LeetCode to strengthen my problem-solving approach.',
      ],
      category: 'Self-learning',
    },
    {
      label: 'My First Product Experience',
      date: 'Nov 2024 – Mar 2025',
      title: 'MentorBridge — React Native Developer',
      body: [
        'MentorBridge gave me the opportunity to work on Stupro, a product where I contributed as a React Native developer.',
        'This experience introduced me to working on a product rather than just building isolated learning applications.',
        'I also explored backend development, APIs and how different parts of an application communicate.',
      ],
      category: 'Product work',
    },
    {
      label: 'Expanding into Web Development',
      date: 'Jun 2025 – Jan 2026',
      title: 'Techjays — Software Development Intern',
      body: [
        'At Techjays, I initially worked on a React Native application, gaining experience with mobile application development in a professional environment.',
        'Later, I was assigned web development work, which led me to explore React with TypeScript more deeply.',
        'This transition helped me expand my experience from mobile applications to web development and strengthened my understanding of frontend engineering.',
      ],
      category: 'Internship',
    },
    {
      label: 'Working Across the Stack',
      date: 'Feb 2026 – Present',
      title: 'Sukiran Solutions — Software Engineer',
      body: [
        'My journey continued into a full-stack engineering role.',
        'I now work across frontend and backend development, contributing to features using technologies including React, Node.js, Django and PostgreSQL.',
        'This experience is helping me understand the broader engineering process: working with application requirements, connecting systems, making technical decisions and developing complete features.',
      ],
      category: 'Employment',
    },
    {
      label: 'Beyond the Code',
      title: 'Learning, Connecting and Exploring',
      body: [
        'My learning has never been limited to a development environment.',
        'Participating in Tamilpreneur events has given me opportunities to engage with the wider technology and entrepreneurial community.',
        'I also participated in a Zoho Hackathon, where I experienced a different side of problem-solving and collaborative development.',
        'I continue to explore new tools, learn from other developers and challenge myself through new experiences.',
      ],
      category: 'Community',
    },
    {
      label: 'Claude Code in Action',
      date: '2026',
      title: 'Learning AI-powered Development Workflows',
      body: ['Completed Anthropic’s Claude Code in Action course, exploring AI-powered coding workflows and how developer tools are evolving.'],
      category: 'Course',
    },
  ] as Achievement[],

  articlesLead: [
    'Thoughts from the process of learning and building.',
    'I write about the things I explore, the concepts I try to understand and the experiences that shape my journey as a developer.',
    'From technical concepts and development practices to reflections on learning and building products, each article is an opportunity to turn an experience into something worth sharing.',
    'Writing helps me understand what I learn, not just remember it.',
  ],
  articlesEpigraph: 'The distance between knowing and understanding is where most of my growth happens.',
  articlesUrl: LINKS.medium,

  articles: [
    {
      topic: 'Career',
      title: 'Evolving Through the Chapters of Life',
      excerpt: 'A personal reflection on growth, learning, and the journey of self-discovery in life and career.',
      date: 'Aug 2025',
      readTime: '5 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/evolving-through-the-chapters-of-life-2496e0795daf',
      // Original ink illustration in the journal style: a path from a seed, through chapters i–iv, to a tree
      image: '/articles/evolving-chapters.svg',
    },
    {
      topic: 'React',
      title: 'Optimizing React Application Performance: A Beginner-Friendly Guide',
      excerpt: 'Essential techniques and best practices to improve the performance of your React applications.',
      date: 'Jan 2024',
      readTime: '8 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/optimizing-react-application-performance-a-beginner-friendly-guide-089998271cd5',
    },
    {
      topic: 'Career',
      title: 'The Journey That Changed My Path',
      excerpt: 'The experiences that shaped my career and personal development.',
      date: 'Jan 2024',
      readTime: '6 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/the-journey-that-changed-my-path-f8a35bbde03b',
    },
    {
      topic: 'React',
      title: 'A Beginner’s Guide to Redux for State Management in React',
      excerpt: 'Understanding and implementing Redux for managing state in React applications.',
      date: 'Dec 2023',
      readTime: '10 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/a-beginners-guide-to-redux-for-state-management-in-react-8d91eda7a1fb',
    },
    {
      topic: 'Stupro',
      title: 'From Small Cuts to Big Wins: How Stupro is the Game-Changer for Students',
      excerpt: 'How Stupro helps students achieve their goals.',
      date: 'Dec 2023',
      readTime: '7 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/from-small-cuts-to-big-wins-how-stupro-is-the-game-changer-for-students-b013bb4ae318',
    },
    {
      topic: 'Stupro',
      title: 'The Hidden Talents That Lack Guidance and the App That Can Change Their Journey',
      excerpt: 'How technology can help discover and nurture hidden talents in students.',
      date: 'Dec 2023',
      readTime: '6 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/the-hidden-talents-that-lack-guidance-and-the-app-that-can-change-their-journey-4a048d7d4131',
    },
    {
      topic: 'Career',
      title: 'The Art of Writing Email: Learned from My Mentor',
      excerpt: 'Lessons and best practices for writing effective professional emails, learned from a mentor.',
      date: 'Dec 2023',
      readTime: '5 min read',
      publisher: 'Medium',
      href: 'https://medium.com/@meenasad09/the-art-of-writing-email-learned-from-my-mentor-3b604c53617a',
    },
  ] as Article[],

  about: {
    heading: 'A little about me',
    /** Shown on the book's right page (fits the page); phones show the full text below the book */
    pageParagraphs: [
      'I started with a curiosity about mobile applications — how something created through code could live in someone’s hands and become part of their everyday life.',
      'That curiosity took me from Java and Flutter to JavaScript, React Native and React, and into backend development, databases, APIs and Data Structures and Algorithms.',
      'Internships, product work and my role today taught me to look beyond writing code. I am still learning, still experimenting and still discovering how much there is to build.',
    ],
    paragraphs: [
      'I am a software engineer who started with a curiosity about mobile applications and gradually discovered a much bigger world of engineering.',
      'What fascinated me initially was the idea that something created through code could live in someone’s hands and become part of their everyday life. I wanted to understand how that happened.',
      'That curiosity took me through different technologies, from Java and Flutter to JavaScript, React Native and React. Along the way, I explored backend development, databases, APIs and problem-solving with Data Structures and Algorithms.',
      'Through internships, product development and professional experience, I have learned to look beyond writing code. I enjoy understanding how things work, why a particular solution makes sense and how different pieces come together to solve a problem.',
      'Today, I work across full-stack development, building and exploring digital products while continuously strengthening my engineering fundamentals.',
      'I am particularly interested in creating useful applications, understanding systems and finding better ways to turn ideas into working solutions.',
      'I am still learning, still experimenting and still discovering how much there is to build.',
    ],
    /** Left page */
    quote: [
      'I was drawn to the magic of making things work.',
      'An idea becoming an application. A few lines of code becoming something someone can use. Technology bringing people a little closer.',
      'That curiosity became a journey I am still discovering.',
    ],
    signature: '— A work in progress —',
    portrait: undefined as string | undefined,
  },

  contact: {
    heading: 'Let’s talk',
    lead: [
      'Have an interesting idea, a project to build, an opportunity to explore or simply want to talk about technology?',
      'I’d love to hear from you.',
      'Let’s start a conversation.',
    ],
    email: 'meenasivakumar44@gmail.com',
    resumeUrl: '/Meena_Sivakumar_Resume.pdf',
    links: [
      { label: 'GitHub', href: LINKS.github },
      { label: 'LinkedIn', href: LINKS.linkedin },
      { label: 'LeetCode', href: LINKS.leetcode },
      { label: 'Medium', href: LINKS.medium },
    ],
    /** The back cover, after the book closes */
    signOff: [
      'I started by wondering how applications were made.',
      'Somewhere along the way, I found myself exploring the world behind them — one language, one problem and one project at a time.',
      'There is still so much I want to understand and create.',
      'The story continues.',
    ],
    /** Phones: the back cover is small, so it carries the first and last lines */
    signOffShort: ['I started by wondering how applications were made.', 'The story continues.'],
    opener: 'Possibility is a good place to start.',
  },

  toolkit: {
    eyebrow: 'Index',
    title: 'Toolkit',
    lead: 'Everything from the journey in one place — the tools I work with and the practices behind them.',
    /** Languages / mobile / web / tools — core tools are highlighted within their group */
    groups: TOOLKIT_GROUPS.map((g) => ({
      label: g.label,
      items: ALL_TOOLS.filter((t) => (TOOLKIT_CATEGORY[t] ?? 'tools') === g.id),
    })).filter((g) => g.items.length > 0),
    core: TOOLKIT.core,
    practicesLabel: 'Engineering practices',
    practices: TOOLKIT.practices,
  },

  /** Short lines shown as full-width breaks between chapters */
  breaks: {
    afterProjects: 'Still becoming. Always building.',
    afterAchievements: 'Learning is my favourite form of forward motion.',
    afterArticles: 'Not a finished story. A growing body of work.',
  },

  footerLine: 'I build. I question. I begin again.',

  /** Every line, grouped — swap placements above from here; the terminal's `quote` command draws from it too. */
  quoteLibrary: {
    curiosity: [
      'Every page I turn teaches me a different way to see what hasn’t been built yet.',
      'I am drawn to the space between what is imagined and what is possible.',
      'Curiosity gives an idea its first shape; creation gives it somewhere to belong.',
    ],
    journey: [
      'I began by learning how screens work. Somewhere along the way, I became curious about everything happening behind them.',
      'Each technology introduced me to a new possibility; each challenge introduced me to a new version of myself.',
      'I have built things to learn, learned things to build, and somewhere between the two, found my direction.',
      'The distance between knowing and understanding is where most of my growth happens.',
      'My journey is still being written, but every project leaves a little more understanding on the page.',
    ],
    growth: [
      'I am not in a hurry to become everything. I am interested in becoming something I can be proud of.',
      'There is a quiet ambition in beginning again, especially when you know how much there is left to learn.',
      'Becoming is a process with no final version.',
      'Some destinations are worth pursuing simply because of who the journey asks you to become.',
    ],
    engineering: [
      'A working solution answers the problem. A thoughtful solution understands why the problem existed.',
      'Good engineering begins when the obvious answer stops being enough.',
      'I enjoy the moment when a complicated problem begins to make sense.',
      'Behind every simple experience is a series of decisions that deserve to be anything but simple.',
      'The elegance of a solution often lies in everything the user never has to think about.',
      'I am interested in the invisible decisions that make visible experiences feel effortless.',
      'Building is not just arranging pieces until they work; it is understanding why they belong together.',
    ],
    short: [
      'Still becoming. Always building.',
      'A little curiosity can change the entire direction.',
      'Somewhere between thought and form.',
      'Made of questions, shaped by attempts.',
      'The unfinished has its own kind of possibility.',
      'Learning is my favourite form of forward motion.',
      'Not a finished story. A growing body of work.',
      'I build. I question. I begin again.',
      'Possibility is a good place to start.',
      'There is always another layer to understand.',
    ],
  },

  links: LINKS,
};

export type Content = typeof content;
