# 🧠 NeuralVault (Frontend)

> A zero-friction, interactive interface for an enterprise-grade Retrieval-Augmented Generation (RAG) system.

---

## 🚀 Overview

NeuralVault is a modern, high-performance frontend built to interact with a secure RAG backend. It delivers a seamless user experience for document upload, querying, and knowledge retrieval — designed to feel fast, reactive, and intelligent.

---

## ✨ Features

* ⚡ **Real-time query interface** powered by RAG
* 📂 **Document upload UI** with validation
* 🎯 **Role-aware interaction (RBAC-integrated)**
* 🎨 **Modern UI with animations (Framer Motion)**
* ⚙️ **Optimized performance (Turbopack + Next.js App Router)**
* 🔐 **JWT-based authentication flow**

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **State Management:** React Hooks
* **Deployment:** Vercel

---

## 🧠 How It Works

1. User logs in → receives JWT
2. Uploads documents → sent to backend
3. Queries knowledge base
4. Backend performs RAG → returns answer
5. UI renders response with smooth animations

---

## 📦 Installation

```bash
git clone https://github.com/Vedik-Kothari/neuralvault
cd neuralvault
npm install
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Deployment

Deployed on **Vercel**

```bash
vercel
```

---

## 📸 UI Highlights

* Interactive cursor-based animations
* Smooth transitions between states
* Minimalist, high-performance layout

---

## 🔗 Backend

This frontend connects to:

👉 https://github.com/Vedik-Kothari/neuralvault-api

---

## 🧩 Future Improvements

* Streaming responses (real-time tokens)
* Chat history persistence
* Dark/light theme toggle
* Multi-document query context

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Vedik Kothari**

---

⭐ Star the repo if you found it useful!
