/**
 * Technology map. Items come from the résumé's skills/tools and project stacks;
 * each link connects two technologies used together on a named project.
 */
export interface TechItem {
  id: string;
  label: string;
  group: string;
}
export interface TechGroup {
  id: string;
  label: string;
}

export const CENTER_LABEL = 'Meena';

export const groups: TechGroup[] = [
  { id: 'web', label: 'Frontend' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'backend', label: 'Backend & data' },
  { id: 'tools', label: 'Tools & DevOps' },
];

export const items: TechItem[] = [
  { id: 'react', label: 'React', group: 'web' },
  { id: 'typescript', label: 'TypeScript', group: 'web' },
  { id: 'redux', label: 'Redux', group: 'web' },
  { id: 'tailwind', label: 'Tailwind CSS', group: 'web' },
  { id: 'htmlcss', label: 'HTML & CSS', group: 'web' },

  { id: 'react-native', label: 'React Native', group: 'mobile' },
  { id: 'flutter', label: 'Flutter', group: 'mobile' },
  { id: 'android', label: 'Android (Java)', group: 'mobile' },
  { id: 'sqflite', label: 'Sqflite', group: 'mobile' },

  { id: 'node', label: 'Node.js', group: 'backend' },
  { id: 'django', label: 'Django', group: 'backend' },
  { id: 'spring', label: 'Spring Boot', group: 'backend' },
  { id: 'postgres', label: 'PostgreSQL', group: 'backend' },
  { id: 'mongodb', label: 'MongoDB', group: 'backend' },
  { id: 'firebase', label: 'Firebase', group: 'backend' },

  { id: 'figma', label: 'Figma', group: 'tools' },
  { id: 'docker', label: 'Docker', group: 'tools' },
  { id: 'jenkins', label: 'Jenkins', group: 'tools' },
  { id: 'gh-actions', label: 'GitHub Actions + SonarQube', group: 'tools' },
  { id: 'postman', label: 'Postman', group: 'tools' },
];

export const links: [string, string][] = [
  // Stupro
  ['react-native', 'spring'],
  ['spring', 'mongodb'],
  ['react-native', 'typescript'],
  ['figma', 'react-native'],
  // Techjays
  ['react-native', 'redux'],
  ['react', 'redux'],
  ['react', 'typescript'],
  ['react', 'tailwind'],
  // Sukiran Solutions
  ['react', 'node'],
  ['react', 'django'],
  ['django', 'postgres'],
  // Personal apps
  ['flutter', 'firebase'],
  ['flutter', 'sqflite'],
];

export const groupIndex = (id: string) => groups.findIndex((g) => g.id === id);

export function neighbours(id: string) {
  const set = new Set<string>();
  links.forEach(([a, b]) => {
    if (a === id) set.add(b);
    if (b === id) set.add(a);
  });
  return set;
}
