# 🧠 SecondBrain

A full-stack app to save and organize your important links — YouTube videos, tweets, Reddit posts, Instagram links, articles — all in one place. Share your brain with others via a public link.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (cloud via Atlas)

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/secondbrain?retryWrites=true&w=majority
JWT_SECRET=some_very_long_random_secret_string
PORT=3001
```

Start the backend:
```bash
npm run dev
```

The backend runs at **http://localhost:3001**

---

### 2. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**

---

## Features

- ✅ **Signup / Login** with JWT auth
- ✅ **Save links** — YouTube, Twitter/X, Reddit, Instagram, Articles
- ✅ **YouTube embeds** — inline video player in cards
- ✅ **Twitter embeds** — live tweet cards
- ✅ **Filter by source** — sidebar navigation
- ✅ **Search** — by title or tags
- ✅ **Delete content**
- ✅ **Share your brain** — toggle a public link others can view
- ✅ **View shared brains** — no login required

---

## Project Structure

```
secondbrain/
├── backend/
│   ├── src/
│   │   ├── models/       # User, Content mongoose models
│   │   ├── routes/       # auth, content, share routes
│   │   ├── middleware/   # JWT auth middleware
│   │   └── index.ts      # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/   # ContentCard, Sidebar, Modals
    │   ├── pages/        # Signup, Login, Dashboard, SharedBrain
    │   ├── hooks/        # useAuth context
    │   ├── lib/          # axios instance, embed helpers
    │   └── types/        # TypeScript interfaces
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

---

