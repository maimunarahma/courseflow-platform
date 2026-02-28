# 🚀 Quick Start - AI Features

Get AI features running with your backend:

## Step 1: Backend Setup

You'll need to implement these endpoints in your backend:

```
POST /api/ai/chat
POST /api/ai/generate-quiz
POST /api/ai/recommendations
POST /api/ai/study-notes
POST /api/ai/code-review
```

See the Backend Integration Guide below for details.

---

## Step 2: Configure Frontend (1 min)

```bash
# Create .env file in project root
cat > .env << EOF
VITE_SERVER_URL=http://localhost:5000/api
EOF
```

---

## Step 3: Install & Run (2 min)

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Open browser at http://localhost:8080
```

---

## Backend Integration Guide

### Endpoint 1: AI Chat Assistant
```typescript
// POST /api/ai/chat
// Request:
{
  lessonTitle: string,
  lessonContext: string,
  question: string,
  conversationHistory: ChatMessage[]
}

// Response:
{
  response: string  // AI's answer
}
```

### Endpoint 2: Quiz Generator
```typescript
// POST /api/ai/generate-quiz
// Request:
{
  courseTitle: string,
  lessonContent: string,
  numQuestions: number
}

// Response:
{
  questions: [
    {
      question: string,
      options: string[],
      correctAnswer: number,
      explanation: string
    }
  ]
}
```

### Endpoint 3: Recommendations
```typescript
// POST /api/ai/recommendations
// Request:
{
  userProfile: {
    completedCourses: string[],
    currentCourses: string[],
    interests: string[],
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  },
  availableCourses: Course[]
}

// Response:
{
  suggestions: [
    {
      courseId: string,
      relevanceScore: number,
      reason: string
    }
  ]
}
```

---

## ✅ Frontend Components Ready to Use

- [ ] `AIAssistant` - Chat widget (already integrated in Learn page)
- [ ] `AIQuizGenerator` - Quiz generator component
- [ ] `AIRecommendations` - Recommendations card (already in Dashboard)
- [ ] `AIFeaturesShowcase` - Marketing section

---

## 🐛 Common Issues

### "Network Error"
```bash
# Make sure backend is running
# Check VITE_SERVER_URL in .env
# Verify CORS is enabled on backend
```

---

## 🚀 Deploy to Vercel

```bash
# In Vercel dashboard:
# Settings → Environment Variables → Add:
VITE_SERVER_URL=https://your-backend.herokuapp.com/api

git push origin main
```

---

**Frontend is ready - implement the backend endpoints when you're ready! 🎉**
