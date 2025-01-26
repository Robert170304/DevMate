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


export const explorerData: ExplorerItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          {
            id: "3",
            name: "HeroSection",
            type: "folder",
            children: [
              {
                id: "4",
                name: "HeroSection.tsx",
                type: "file",
                content: "// HeroSection component code goes here",
              },
              {
                id: "5",
                name: "HeroSection.scss",
                type: "file",
                content: "/* HeroSection-specific styles */",
              },
            ],
          },
          {
            id: "6",
            name: "Footer",
            type: "folder",
            children: [
              {
                id: "7",
                name: "Footer.tsx",
                type: "file",
                content: "// Footer component code goes here",
              },
              {
                id: "8",
                name: "Footer.scss",
                type: "file",
                content: "/* Footer-specific styles */",
              },
            ],
          },
        ],
      },
      {
        id: "9",
        name: "styles",
        type: "folder",
        children: [
          {
            id: "10",
            name: "global.scss",
            type: "file",
            content: "/* Global styles */",
          },
          {
            id: "11",
            name: "HeroSection.scss",
            type: "file",
            content: "/* HeroSection-specific styles */",
          },
        ],
      },
      {
        id: "12",
        name: "utils",
        type: "folder",
        children: [
          {
            id: "13",
            name: "fetchData.ts",
            type: "file",
            content: "// Utility function to fetch data",
          },
          {
            id: "14",
            name: "formatDate.ts",
            type: "file",
            content: "// Utility function to format date",
          },
        ],
      },
    ],
  },
  {
    id: "15",
    name: "public",
    type: "folder",
    children: [
      {
        id: "16",
        name: "favicon.ico",
        type: "file",
        content: "/* Favicon file */",
      },
      {
        id: "17",
        name: "logo.png",
        type: "file",
        content: "/* Logo image file */",
      },
    ],
  },
  {
    id: "18",
    name: "package.json",
    type: "file",
    content: `
{
  "name": "devmate",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "next": "13.4.9",
    "mantine": "^6.0.0"
  }
}
`,
  },
  {
    id: "19",
    name: "README.md",
    type: "file",
    content: "# DevMate\nThis is a knowledge explorer project built with Next.js.",
  },
];
