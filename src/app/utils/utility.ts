import { IconCode, IconRobot, IconUsers } from '@tabler/icons-react';

export const emptyFileObj: FileItemDTO = { path: "", content: "", id: "", name: "", parentId: "" }

export const privateRoutes = [
  { path: "/workspace", name: "workspace" },
  { path: "/share", name: "share" },
  { path: "/live-preview", name: "live preview" }
]

export const footerLinks = [
  { link: '/about-devmate', label: 'Learn More' },
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
      'Collaborate with your team in real-time. Share code, and communicate seamlessly.',
    icon: IconUsers,
  },
  {
    title: 'Multi-Language Support',
    description:
      'Run and test code in multiple programming languages. Get instant feedback on your code execution.',
    icon: IconCode, // Updated to a relevant icon
  },
];


export const explorerData: ExplorerItem[] = [
  {
    parentId: "root",
    id: "1",
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        path: "src/components",
        parentId: "1",
        children: [
          {
            id: "3",
            name: "HeroSection",
            type: "folder",
            path: "src/components/HeroSection",
            parentId: "2",
            children: [
              {
                id: "4",
                name: "HeroSection.tsx",
                type: "file",
                path: "src/components/HeroSection/HeroSection.tsx",
                content: "// HeroSection component code goes here",
                parentId: "3",
              },
              {
                id: "5",
                name: "HeroSection.scss",
                type: "file",
                path: "src/components/HeroSection/HeroSection.scss",
                content: "/* HeroSection-specific styles */",
                parentId: "3",
              },
            ],
          },
          {
            id: "6",
            name: "Footer",
            type: "folder",
            path: "src/components/Footer",
            parentId: "2",
            children: [
              {
                id: "7",
                name: "Footer.tsx",
                type: "file",
                path: "src/components/Footer/Footer.tsx",
                content: "// Footer component code goes here",
                parentId: "6",
              },
              {
                id: "8",
                name: "Footer.scss",
                type: "file",
                path: "src/components/Footer/Footer.scss",
                content: "/* Footer-specific styles */",
                parentId: "6",
              },
            ],
          },
        ],
      },
      {
        id: "9",
        name: "styles",
        type: "folder",
        path: "src/styles",
        parentId: "1",
        children: [
          {
            id: "10",
            name: "global.scss",
            type: "file",
            path: "src/styles/global.scss",
            content: "/* Global styles */",
            parentId: "9",
          },
          {
            id: "11",
            name: "HeroSection.scss",
            type: "file",
            path: "src/styles/HeroSection.scss",
            content: "/* HeroSection-specific styles */",
            parentId: "9",
          },
        ],
      },
      {
        id: "12",
        name: "utils",
        type: "folder",
        path: "src/utils",
        parentId: "1",
        children: [
          {
            id: "13",
            name: "fetchData.ts",
            type: "file",
            path: "src/utils/fetchData.ts",
            content: "// Utility function to fetch data",
            parentId: "12",
          },
          {
            id: "14",
            name: "formatDate.ts",
            type: "file",
            path: "src/utils/formatDate.ts",
            content: "// Utility function to format date",
            parentId: "12",
          },
        ],
      },
    ],
  },
  {
    id: "15",
    name: "public",
    type: "folder",
    path: "public",
    parentId: "root",
    children: [
      {
        id: "16",
        name: "favicon.ico",
        type: "file",
        path: "public/favicon.ico",
        content: "/* Favicon file */",
        parentId: "15",
      },
      {
        id: "17",
        name: "logo.png",
        type: "file",
        path: "public/logo.png",
        content: "/* Logo image file */",
        parentId: "15",
      },
    ],
  },
  {
    id: "18",
    name: "package.json",
    type: "file",
    path: "package.json",
    parentId: "root",
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
    path: "README.md",
    content: "# DevMate\nThis is a knowledge explorer project built with Next.js.",
    parentId: "root",
  },
];


export const languageMap: { [key: string]: string } = {
  ts: "typescript",
  js: "javascript",
  jsx: "javascript",
  tsx: "typescript",
  scss: "scss",
  sass: "sass",
  html: "html",
  css: "css",
  less: "less",
  py: "python",
  rb: "ruby",
  java: "java",
  kt: "kotlin",
  swift: "swift",
  php: "php",
  c: "c",
  cpp: "cpp",
  h: "cpp",
  hpp: "cpp",
  cs: "csharp",
  csx: "csharp",
  go: "go",
  rs: "rust",
  dart: "dart",
  scala: "scala",
  sh: "bash",
  bash: "bash",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  json: "json",
  xml: "xml",
  md: "markdown",
  markdown: "markdown",
  ini: "ini",
  conf: "ini",
  toml: "toml",
  lua: "lua",
  perl: "perl",
  pl: "perl",
  pm: "perl",
  r: "r",
  tex: "latex",
  vue: "vue",
  svelte: "svelte",
  elm: "elm",
  handlebars: "handlebars",
  hbs: "handlebars",
  pug: "pug",
  jade: "pug",
  vb: "vbnet",
  fsharp: "fsharp",
  ml: "ocaml",
  ocaml: "ocaml",
  coffee: "coffeescript",
  litcoffee: "coffeescript",
  asm: "assembly",
  s: "assembly",
  pas: "pascal",
  clj: "clojure",
  cljs: "clojure",
  edn: "clojure",
  erl: "erlang",
  ex: "elixir",
  exs: "elixir",
  dockerfile: "docker",
  makefile: "makefile",
  cmake: "cmake",
  groovy: "groovy",
  gradle: "groovy",
  kotlin: "kotlin",
  vbscript: "vbscript",
  asp: "asp",
  jsxbin: "jsxbin",
  aspnet: "aspnet",
  bat: "batch",
  cmd: "batch",
  awk: "awk",
};