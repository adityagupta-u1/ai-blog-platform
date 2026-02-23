🤖 AI-Powered Blog Platform

🔗 Live Demo: https://ai-blog-platform-ecru.vercel.app/
📂 Repository: https://github.com/adityagupta-u1/ai-blog-platform

A production-ready full-stack blog platform powered by AI with intelligent content generation, caching, and type-safe APIs.

Built using Next.js (App Router), tRPC, Drizzle ORM, PostgreSQL (Neon), Redis, and AI APIs, this project demonstrates scalable architecture, performance optimization, and modern backend engineering practices.

🚀 Features

✍️ AI-powered blog generation

🧠 Smart title, summary & content suggestions

⚡ Redis caching for performance optimization

🔐 Secure authentication (Clerk)

📚 Category-based blog organization

🗂️ Draft & publish workflow

🛡️ Protected API routes

⚡ End-to-end type safety with tRPC

🗄️ PostgreSQL with Drizzle ORM

🎨 Responsive UI with TailwindCSS

🛠️ Tech Stack
Frontend

Next.js (App Router)

React

TailwindCSS

TypeScript

Backend

tRPC

Drizzle ORM

PostgreSQL (Neon)

Clerk Authentication

Caching Layer

Redis (Upstash / self-hosted)

AI Integration

OpenAI / Google Gemini (configurable)

🏗️ System Architecture
Client (Next.js UI)
        ↓
tRPC (Type-safe API layer)
        ↓
Business Logic Layer
        ↓
Redis Cache (fast retrieval)
        ↓
PostgreSQL (Neon)
        ↓
AI Service (OpenAI / Gemini)
🔥 Why Redis?

Redis is used to:

Cache frequently accessed blog posts

Reduce database load

Improve response time

Cache AI-generated results

Enable future scalability (rate limiting, session storage)

📦 Installation
git clone https://github.com/adityagupta-u1/ai-blog-platform.git
cd ai-blog-platform
npm install
🔐 Environment Variables

Create a .env file:

DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY= (or GEMINI_API_KEY)
REDIS_URL=
REDIS_TOKEN=
🧪 Run Locally
npm run dev

Visit: http://localhost:3000

🗄️ Database Setup
npx drizzle-kit generate
npx drizzle-kit push
⚡ Caching Strategy
Layer	What is Cached	Why
Blog Posts	Frequently viewed posts	Reduce DB queries
AI Responses	Generated content	Avoid repeated API cost
Categories	Static data	Faster page loads

🎯 What This Project Demonstrates

Full-stack TypeScript architecture

Type-safe APIs with tRPC

Server Components vs Client Components

Database schema management with Drizzle

Redis caching patterns

AI integration in real-world applications

Scalable backend design principles

Clean, modular folder structure

🌍 Deployment

Recommended setup:

Vercel → Frontend + API

Neon → PostgreSQL

Upstash Redis → Caching

Clerk → Authentication

📈 Future Improvements

AI-powered SEO optimization

Blog analytics dashboard

Comment & reaction system

Background job queue (Redis-based)

Content moderation AI

Rate limiting using Redis

Vector search for semantic blog discovery

👨‍💻 Author

Aditya Gupta
Full Stack Developer
Kanpur, India