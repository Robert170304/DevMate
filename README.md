# 📝 DevMate - AI-Powered Collaborative Coding Platform

DevMate is an advanced, AI-integrated code editor that allows real-time collaboration, AI-driven code improvements, and seamless development workflows. Whether you're working solo or in a team, DevMate enhances your coding experience with intelligent suggestions, live code sharing, and interactive debugging.

---

## 📚 Table of Contents

- [✨ Features](#features)
- [💻 Technologies Used](#technologies-used)
- [⚙️ Installation](#installation)
- [🚀 Usage](#usage)
- [🔗 API and Integrations](#api-and-integrations)
- [🤝 Contributing](#contributing)
- [📜 License](#license)
- [📧 Contact](#contact)

---

## ✨ Features

- **🤖 AI-Powered Code Assistance**: Get instant code suggestions, improvements, and explanations using OpenAI's GPT-4o model.
- **👥 Real-time Collaboration**: Work on the same codebase with multiple users simultaneously.
- **📂 Project & File Management**: Create, organize, and manage files effortlessly within the workspace.
- **🖥️ Integrated Terminal**: Execute code in a built-in terminal, enhancing workflow efficiency.
- **🔗 Shareable Code Links**: Generate and share code snippets with a unique link.
- **📌 AI Chatbox**: Communicate with AI to debug and enhance your code without leaving the editor.
- **🌍 Web-Based Development**: No setup required—start coding instantly in your browser.

---

## 💻 Technologies Used

- **Frontend**: Next.js (🛠️ App Router)
- **Styling**: 🎨 Mantine UI, SCSS
- **State Management**: 🗂️ Redux Toolkit
- **AI Integration**: 🤖 OpenAI GPT-4o
- **Real-Time Collaboration**: 🔌 Socket.io
- **Code Editing**: 📝 Monaco Editor
- **Languages & Libraries**: 💻 TypeScript, 📦 react-icons, tabler icons
- **Deployment**: 🚀 Vercel & Render.com

---

## ⚙️ Installation

### Prerequisites

- 🧩 Node.js (>= 16.x)
- 📦 Yarn package manager

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/robert170304/devmate.git
   cd devmate
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env.local` for environment variables:
   ```env
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_secret_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=genrate_random_base64_character
   AZURE_OPENAI_ENDPOINT=https://models.inference.ai.azure.com
   NEXT_PUBLIC_SOCKET_URL=your_websocket_url
   FRONTEND_URL=frontend_app_url
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```
5. 🌐 Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🚀 Usage

1. **👨‍💻 Start Coding**: Open the workspace and begin writing code in your preferred language.
2. **🤝 Collaborate in Real-Time**: Share your session with others and work on code together.
3. **📩 AI-Powered Assistance**: Get intelligent code suggestions, explanations, and improvements.
4. **🔗 Share Code**: Generate a shareable link to showcase your code.

---

## 🔗 API and Integrations

- **🤖 OpenAI GPT-4o**: AI-powered code improvements and assistance.
- **🛜 Socket.io**: Real-time collaboration and live editing.

**⚠️ Important**: Use environment variables to secure API keys in `.env.local`.

---

## 🤝 Contributing

I ❤️ contributions! Follow these steps:

1. Fork the repo.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request for review..

---

## 📜 License

This project is under the [MIT License](LICENSE).

---

## 📧 Contact

For questions or feedback, feel free to reach out::

- **👤 Name**: Robert Macwan
- **📧 Email**: [macwanrobert04@gmail.com](mailto:macwanrobert04@gmail.com)
- **🐙 GitHub**: [robert170304](https://github.com/robert170304)

Elevate your development experience with **DevMate**! 🚀
