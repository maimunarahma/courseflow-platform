# Chat History Backend Integration Guide

## Overview
This document outlines the backend implementation for AI chat assistant with automatic conversation persistence in the User schema.

## Database Schema

### User Model Enhancement
The chat history is stored directly in the User model's `chatHistory` array:

```typescript
import mongoose from "mongoose";

export enum Role {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin"
}

export enum chatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

const chatMessageSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(chatRole),
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  chatHistory: Array<{
    courseId: mongoose.Types.ObjectId;
    role: string;
    content: string;
    timestamp: Date;
  }>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.STUDENT },
  chatHistory: {
    type: [chatMessageSchema],
    default: [],
  }
}, { timestamps: true });

// Optional: Limit chat history to most recent 100 messages per user
userSchema.pre('save', function(next) {
  if (this.chatHistory && this.chatHistory.length > 100) {
    this.chatHistory = this.chatHistory.slice(-100);
  }
  next();
});

export const User = mongoose.model("User", userSchema);
```

## API Endpoint

### Ask Course Question (with auto-save)
**Endpoint:** `POST /api/chat/ask/:courseId`

**Description:** Send a message to AI assistant. Backend automatically saves both user message and AI response to User.chatHistory array.

**Request:**
```typescript
POST /api/chat/ask/:courseId
Headers: {
  Cookie: "refreshToken=<user-token>"
}
Body: {
  message: string  // User's question
}
```

**Backend Implementation:**
```typescript
export const askCourseQuestion = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const userData = verifyToken(token, "secretrefresh") as { userId: string };
    const userId = userData.userId;

    // Validate input
    if (!courseId || !message?.trim()) {
      return res.status(400).json({ 
        message: "courseId and message are required" 
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      course: courseId 
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: "You must be enrolled in this course to use the assistant" 
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get user for chat history
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's chat history for this course (last 10 messages for context)
    const courseHistory = user.chatHistory
      .filter((msg: any) => msg.courseId.toString() === courseId)
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

    // Prepare course context
    const courseObjectives = course.courseObjectives || [];
    const lessonTitles = course.lessons.map((l: any) => l.title).filter(Boolean);

    // Generate AI response with course context
    const prompt = courseChatPrompt(
      course.title,
      course.description,
      course.courseLevel,
      courseObjectives,
      lessonTitles,
      courseHistory,
      message
    );

    const aiResponse = await callGemini(prompt); // or callOpenAI, callClaude, etc.

    // Save user message to chat history
    user.chatHistory.push({
      courseId: new mongoose.Types.ObjectId(courseId),
      role: chatRole.USER,
      content: message.trim(),
      timestamp: new Date()
    });

    // Save AI response to chat history
    user.chatHistory.push({
      courseId: new mongoose.Types.ObjectId(courseId),
      role: chatRole.ASSISTANT,
      content: aiResponse,
      timestamp: new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        message: message.trim(),
        response: aiResponse,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ 
      message: "Error processing your question",
      error: (error as Error).message 
    });
  }
};
```

## courseChatPrompt Helper Function

```typescript
function courseChatPrompt(
  courseTitle: string,
  courseDescription: string,
  courseLevel: string,
  objectives: string[],
  lessonTitles: string[],
  conversationHistory: Array<{ role: string; content: string }>,
  currentQuestion: string
): string {
  const historyText = conversationHistory
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  return `You are an AI learning assistant for the course "${courseTitle}".

Course Information:
- Description: ${courseDescription}
- Level: ${courseLevel}
- Objectives: ${objectives.join(', ')}
- Lessons: ${lessonTitles.join(', ')}

Previous Conversation:
${historyText || 'No previous conversation'}

Student Question: ${currentQuestion}

Provide a helpful, clear, and encouraging response that helps the student understand the topic. Use examples when appropriate.`;
}
```

## Frontend Integration

The frontend has been simplified to work with your backend approach:

### AIAssistant Component Behavior:
1. **No History Loading:** Chat starts fresh with greeting message each time
2. **Auto-save on Backend:** When user sends message, backend automatically saves to `User.chatHistory`
3. **Simple Request:** Frontend only sends `{ message: string }` - no conversation history needed
4. **Error Handling:** Shows enrollment errors and network errors appropriately

### Frontend API Call:
```typescript
// Send message - backend handles all history management
const response = await axios.post(
  `${VITE_SERVER_URL}/chat/ask/${courseId}`,
  { message: userMessage },
  { withCredentials: true }
);

// Extract response
const aiResponse = response.data?.data?.response;
```

## Key Features

### ✅ Automatic Persistence
- Every message automatically saved to User.chatHistory
- No separate chat session collection needed
- History persists per user, tagged by courseId

### ✅ Enrollment Verification
- Backend checks user enrollment before allowing chat
- Returns 403 if not enrolled

### ✅ Context-Aware Responses
- Backend retrieves last 10 messages from user's history for that course
- Provides course details (title, description, objectives, lessons) to AI
- Maintains conversation context automatically

### ✅ Scalability
- Pre-save hook limits history to 100 messages per user
- Prevents database bloat
- Older messages automatically removed

## Testing

### Test the Flow:
1. **Enroll in a course** (prerequisite)
2. **Open AI Assistant** on Learn page
3. **Send a message** - should receive AI response
4. **Check MongoDB** - verify messages saved in User.chatHistory
5. **Send another message** - verify context maintained
6. **Try unenrolled course** - should get 403 error

### Sample MongoDB Query:
```javascript
// Find user's chat history for specific course
db.users.findOne(
  { _id: ObjectId("userId") },
  { 
    chatHistory: { 
      $filter: { 
        input: "$chatHistory", 
        cond: { $eq: ["$$this.courseId", ObjectId("courseId")] } 
      } 
    } 
  }
)
```

## Optional Enhancements

### 1. Load Previous History on Frontend
Add an endpoint to retrieve history:
```typescript
// GET /api/chat/history/:courseId
export const getChatHistory = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const token = req.cookies.refreshToken;
  const userData = verifyToken(token, "secretrefresh") as { userId: string };
  
  const user = await User.findById(userData.userId);
  const history = user.chatHistory
    .filter(msg => msg.courseId.toString() === courseId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  
  res.json({ success: true, data: history });
};
```

Then update frontend to load on open:
```typescript
useEffect(() => {
  if (isOpen && messages.length === 1) { // Only greeting
    loadChatHistory();
  }
}, [isOpen]);

const loadChatHistory = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/chat/history/${courseId}`,
      { withCredentials: true }
    );
    
    const history = response.data?.data || [];
    if (history.length > 0) {
      setMessages([messages[0], ...history]); // Keep greeting, add history
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
};
```

### 2. Clear History for Course
```typescript
// DELETE /api/chat/history/:courseId
export const clearChatHistory = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const token = req.cookies.refreshToken;
  const userData = verifyToken(token, "secretrefresh") as { userId: string };
  
  await User.findByIdAndUpdate(userData.userId, {
    $pull: { chatHistory: { courseId: new mongoose.Types.ObjectId(courseId) } }
  });
  
  res.json({ success: true, message: "History cleared" });
};
```

### 3. Analytics
Track AI usage per user:
```typescript
// Add to user schema
const userSchema = new mongoose.Schema({
  // ... existing fields
  aiUsageStats: {
    totalQuestionsAsked: { type: Number, default: 0 },
    coursesWithAI: [{ 
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      questionCount: { type: Number, default: 0 }
    }],
    lastAIInteraction: Date
  }
});

// Update in askCourseQuestion:
user.aiUsageStats.totalQuestionsAsked += 1;
user.aiUsageStats.lastAIInteraction = new Date();
```

## Notes

- Frontend sends each message independently
- Backend manages entire conversation context
- History persists across sessions automatically
- No need for separate ChatSession collection
- Simpler architecture, easier to maintain
- Backend retrieves context from User.chatHistory for each request
