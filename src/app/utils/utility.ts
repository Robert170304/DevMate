import { IconGitBranch, IconRobot, IconUsers } from '@tabler/icons-react';

export const allRoutes = [
  { path: "/", name: "home" },
  { path: "/about-devmate", name: "about" },
  { path: "/workspace", name: "workspace" }
]

export const footerLinks = [
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Terms of Use' },
];


export const headerLinks = [
  { link: '/about-devmate', label: 'About' },
  { link: '/?features=true', label: 'Features' },
  // { link: '/signup', label: 'Sign Up' },
  // { link: '/login', label: 'Login' },
];


export const featuresData = [
  {
    title: 'AI Assistance',
    description:
      'Enhance your coding with AI. Get intelligent code suggestions, error detection, and automated refactoring.',
    icon: IconRobot, // Change this to a more relevant icon
  },
  {
    title: 'Real-time Collaboration',
    description:
      'Collaborate with your team in real-time. Share code, track changes, and communicate seamlessly.',
    icon: IconUsers,
  },
  {
    title: 'Version Control',
    description:
      'Integrate with version control systems. Manage your codebase, track changes, and collaborate efficiently.',
    icon: IconGitBranch, // Change this to a more relevant icon
  },
];
