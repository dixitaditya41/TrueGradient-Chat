# 🤖 TrueGradient Chat — AI-Based Chat Platform

Welcome to **TrueGradient Chat**, a full-stack AI-powered chat platform that integrates authentication, credit-based LLM chat, organization management, and real-time notifications.

This project serves as the **foundational architecture** for a complete AI workspace platform, built with clean code, modular design, and production-level quality.

---

## 📋 Assignment Overview

This project fulfills the core requirements for the **AI Chat Platform Assignment**, including:

1. **Authentication & Onboarding**
2. **Chat Interface with Credit System**
3. **Organization Management**
4. **Real-Time Notifications**
5. **Integrated Frontend & Backend Deployment**

---

## 🧩 Features

### 🔐 Authentication & Onboarding
- Email + Password authentication using JWT.
- Google OAuth (federated sign-in).
- On first signup, a default organization is automatically created.
- Authenticated users are redirected to the main chat UI after onboarding.
- User and token details are securely persisted in localStorage.

### 💬 Chat Interface
- ChatGPT-style responsive UI.
- Left Sidebar → Chat history & navigation.
- Main Chat Area → User and assistant conversation.
- Top Bar → Credits counter, notification bell, and organization switcher.
- Integrated with an **LLM provider** (OpenAI / Gemini / Ollama).
- Persistent chat sessions stored in database.

### 💳 Credit System
- Each message deducts credits based on token usage.
- Users cannot send messages with insufficient credits.
- Dynamic credit counter updates in real-time.
- User credits are stored and updated on backend.

### 🏢 Organization Management
- Create and rename organizations.
- Invite members via email (mock email — stored in DB).
- Switch between multiple organizations (only one active at a time).
- Each user automatically gets a default org upon registration.
- Active organization displayed in Navbar.
- Invitation modal & create organization modal built using a **reusable modal component**.

### 🔔 Real-Time Notifications
- WebSocket (Socket.IO) setup for real-time communication.
- Supports:
  - Global notifications (to all users).
  - Targeted notifications (to specific users).
- Notification bell with unread count.
- Expandable panel showing notification list.
- Persistent notification history stored in database.

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Redux Toolkit, React Router, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js, MongoDB , Socket.IO, JWT, bcrypt |
| **LLM Integration** |  Gemini 
| **Deployment** | Frontend: Vercel , Backend: Render 
| **Auth** | JWT + Google OAuth (OAuth2.0) |

---



### 🖥️ Setup and Start Frontend
1)cd client && npm install
2)npm run dev


### 🖥️ Setup and Start Backend
1)cd server && npm install
2)npm start
