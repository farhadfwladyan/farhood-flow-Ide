 Farhood Cloud Studio

A Cloud-Based Development Environment with AI Assistance**

Farhood Cloud Studio is a web-based coding environment designed to provide developers with a modern workspace for writing, editing, and executing code, with AI-powered assistance.

 🚀 Features

- **AI-Powered Assistant:** Get help with programming, debugging, and understanding code.
- **Code Editor:** Write and manage code in a web-based development environment.
- **Multi-Language Support:** Work with multiple programming languages.
- **Code Execution:** Execute code using supported external execution services.
- **Cloud-Based Workspace:** Access your development environment through a web browser.
- **Modern Interface:** A clean and developer-focused user experience.

 🛠️ Technology Stack

- HTML
- CSS
- JavaScript
- Cloudflare Workers
- Groq API
- Vercel

 🏗️ Architecture

Farhood Cloud Studio uses a frontend-based architecture with Cloudflare Workers acting as a secure proxy for AI requests.

- **Frontend:** Hosted on Vercel.
- **AI Backend:** Cloudflare Workers.
- **AI Provider:** Groq API.
- **Code Execution:** Supported external code execution services.

 ⚙️ Deployment

 Frontend Deployment

The frontend can be deployed using Vercel by connecting this GitHub repository.

 AI Worker Configuration

The Cloudflare Worker requires the following configuration:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key (stored as a secret) |
| `ALLOWED_ORIGIN` | The deployed frontend URL |

Never commit API keys or other sensitive credentials to this repository.

 🌐 Live Project

Website: https://farhood-flow-ide.vercel.app

Active Development

## 👨
