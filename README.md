# CourseMaster – AI-Powered Learning Platform 🚀🤖

A production-ready **AI-enhanced E-learning platform** built with **Vite + React + TypeScript**, **ShadCN UI**, **React Query**, and **OpenAI Integration**. Features intelligent learning assistance, automated quiz generation, and personalized course recommendations.

This client connects to the CourseMaster backend API (Express + MongoDB) and provides a fast, scalable, and AI-powered UI for Students and Admins.

---

## ✨ AI Features (What Makes This Special)

### 🤖 **1. AI Learning Assistant**
- **Context-aware chatbot** that helps students during lessons
- Answers questions based on current lesson content
- Provides examples, explanations, and guided learning
- Multi-turn conversations with memory

### 🎯 **2. AI Quiz Generator**
- **Automatically generates quiz questions** from lesson content
- Creates multiple-choice questions with explanations
- Adapts difficulty based on course level
- Instant feedback and detailed scoring

### 📊 **3. Smart Course Recommendations**
- **Personalized learning path** based on user's progress
- ML-powered relevance scoring (0-100%)
- Considers completed courses, interests, and skill level
- Updates dynamically as user learns

### 📝 **4. AI Study Notes Generator**
- Auto-summarizes lessons into key points
- Generates practice exercises
- Creates study guides automatically

### 💻 **5. AI Code Review (Coming Soon)**
- Automated feedback on programming assignments
- Best practices suggestions
- Bug detection and performance tips

---

## 🚀 Tech Stack

### **Frontend**

* **React.js + TypeScript**
* **Vite** (blazing fast dev & build)
* **OpenAI API / Claude / Gemini** (AI features)
* **React Router DOM** (client-side routing)
* **ShadCN UI + Radix UI** (production-ready UI components)
* **React Query (@tanstack/react-query)** for server-state & caching
* **Axios** (API requests)
* **Zod** (form validation)
* **React Hook Form** (form management)
* **TailwindCSS** (utility-first styling)
* **Lucide Icons**
* **Sonner** (toast notifications)

---

## 📂 Project Structure

```
src/
  ├── api/               # Axios instances & API methods
  ├── components/        # Reusable UI components
  ├── hooks/             # Custom React hooks
  ├── layouts/           # Layout wrappers
  ├── pages/             # Public & Protected pages
  ├── router/            # React Router config
  ├── store/             # Context API or Redux Toolkit
  ├── types/             # TypeScript models
  ├── utils/             # Helper functions
  ├── main.tsx           # App entry point
  └── App.tsx            # Global providers
```

---

## 🔐 Authentication Flow

### **Features:**

* JWT Authentication (stored in HttpOnly cookies)
* Student login/register
* Admin login (separate route)
* Protected routes using React Router
* Auto-refresh user state using React Query

### **Protected Route Example**

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
```

---

## 🎓 Student Features

* Browse all available courses
* Search, filter, sort, and paginate
* View course details
* Enroll in course
* Watch lessons (YouTube/Vimeo embed)
* Progress tracking (e.g., 40% completed)
* Submit assignments (Google Drive link or text)
* Take quizzes → auto-score

---

## 🛠️ Admin Features

* Create / Read / Update / Delete Courses
* Manage Batches
* Track Enrollments
* Review Student Assignments

---

## 🌐 Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=https://your-server-domain.com/api
```

Usage:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

---

## 🚦 Running the Client

### **Install dependencies:**

```bash
npm install
```

### **Start development server:**

```bash
npm run dev
```

### **Build for production:**

```bash
npm run build
```

### **Preview production build:**

```bash
npm run preview
```

---

## 📡 API Communication (React Query)

```ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get("/courses");
      return res.data;
    },
  });
};
```

---

## 🧹 Code Quality

* Zod validation for all forms
* React Query for caching, deduping, stale state handling
* Modular folder structure
* Reusable UI components
* Meaningful toasts (success/error/loading)

---

## 📘 Additional Notes

This is the **client-only repository README** for CourseMaster.
For backend setup (Express + TypeScript + MongoDB), ensure:

* JWT + cookies are configured
* CORS allows credentials
* Secure routes for Students/Admins

---

## 📄 License

MIT License.

---

If you want, I can also generate:
✅ Backend README
✅ Full folder scaffolding for your Vite project
✅ Auth flow code (login, register, refresh)
✅ Course CRUD UI (ShadCN based)

Just tell me! 🚀
