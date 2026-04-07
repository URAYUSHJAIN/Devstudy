# DevStudy 🚀

A comprehensive, interactive learning platform designed to help developers master engineering skills, system design, and coding through hands-on practice.

## ✨ Key Features

- **Interactive Coding Labs**: 
  - **Multi-Language Support**: Write and run code in JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, and PHP.
  - **Hybrid Execution Engine**: 
    - *Web Languages (JS/TS)*: Executed locally in the browser for instant feedback.
    - *System Languages*: Securely executed remotely via the **Piston API**.
  - **Live Web Preview**: Real-time HTML/CSS rendering in a sandboxed environment.
- **System Design Studio**: 
  - Built-in **Mermaid.js** editor for creating flowcharts, sequence diagrams, and architecture diagrams.
  - Live preview and SVG export capabilities.
- **Developer Roadmaps**: Curated learning paths for various engineering roles.
- **Modern UI/UX**: 
  - Fully responsive mobile-first design.
  - Dark/Light mode support.
  - Clean, distraction-free interface.

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [React 19](https://react.dev/)

### Styling & UI
- **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Geist Sans & Mono

### Tools & Libraries
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) (VS Code's editor core)
- **Diagramming**: [mermaid](https://mermaid.js.org/)
- **Execution API**: [Piston](https://github.com/engineer-man/piston)

## 📐 Architecture & Methods

### 1. Code Execution Strategy
The platform uses a **hybrid execution model** to balance performance and capability:
- **Local Execution**: JavaScript and TypeScript are executed directly in the browser using a safe wrapper around 
ew Function(). We intercept console.log to display output in the UI.
- **Remote Execution**: Languages like Python, Java, and C++ are sent to the Piston API. This ensures secure execution of compiled languages without burdening the client.

### 2. System Design Visualization
The **Mermaid Editor** leverages the client-side rendering capabilities of Mermaid.js. It parses text definitions in real-time to generate SVG diagrams, allowing users to visualize complex systems instantly.

### 3. Component Structure
- **Modular Design**: Components like CodeEditor and MermaidEditor are self-contained with their own state management and error handling.
- **Responsive Layouts**: Utilizes Tailwind's grid and flexbox systems to ensure usability across desktop and mobile devices.

## 🚀 Getting Started

1. **Clone the repository**
   `ash
   git clone https://github.com/URAYUSHJAIN/Devstudy.git
   cd Devstudy
   `

2. **Install dependencies**
   `ash
   npm install
   # or
   bun install
   `

3. **Run the development server**
   `ash
   npm run dev
   `

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment Notes (GitHub Auth + Live Battle)

### 1. Required environment variables (web app)

- `GITHUB_ID` and `GITHUB_SECRET` for NextAuth GitHub login
- `NEXTAUTH_SECRET` for session encryption
- `NEXTAUTH_URL` set to your deployed web URL (example: `https://your-app.com`)
- `NEXT_PUBLIC_SOCKET_URL` set to the deployed socket server URL
  - local example: `http://localhost:3001`
  - production example: `https://battle.your-app.com`

### 2. GitHub OAuth callback URL (important)

If you see this error on login:

- `The redirect_uri is not associated with this application`

then your GitHub OAuth App callback does not match your app URL.

In GitHub OAuth App settings, set **Authorization callback URL** to exactly:

- local: `http://localhost:3000/api/auth/callback/github`
- production: `https://your-app.com/api/auth/callback/github`

Also make sure `NEXTAUTH_URL` uses the same origin (`http/https`, domain, and port).

### 3. Socket server deployment

Run the battle socket server as a separate long-running process:

```bash
npm run socket
```

Set this on the socket server environment:

- `CLIENT_ORIGIN` = your web app origin (example: `https://your-app.com`)

### 4. Battle mode behavior

- Battle page requires GitHub sign-in.
- Lobby now shows who is available to fight in real-time.
- Matchmaking uses queue by mode and rating range.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
