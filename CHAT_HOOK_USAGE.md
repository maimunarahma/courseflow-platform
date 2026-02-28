# Chat Hook Usage Guide

## Overview
The `use-chat` hook provides a clean TanStack Query-based interface for managing AI chat functionality with your backend.

## Features
- ✅ Send messages to AI assistant with automatic error handling
- ✅ Get chat history for specific courses
- ✅ Clear chat history
- ✅ Loading states built-in
- ✅ Toast notifications for errors
- ✅ Enrollment verification (403 errors handled)

## Setup

### 1. ChatProvider Added to App.tsx
The `ChatProvider` has been wrapped around your app in `src/App.tsx`:

```tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <CourseProvider>
      <EnrollmentProvider>
        <ChatProvider> {/* ✅ Added */}
          <TooltipProvider>
            {/* Your routes */}
          </TooltipProvider>
        </ChatProvider>
      </EnrollmentProvider>
    </CourseProvider>
  </AuthProvider>
</QueryClientProvider>
```

## Usage

### Basic Usage in Components

```tsx
import { useChat } from '@/hooks/use-chat';

function MyComponent({ courseId }: { courseId: string }) {
  const { sendMessage, isLoadingMessage } = useChat();

  const handleSendMessage = async () => {
    try {
      const response = await sendMessage(courseId, 'What is this about?');
      console.log('AI Response:', response.data.response);
    } catch (error) {
      // Error is automatically toasted by the hook
      console.error('Failed to send message');
    }
  };

  return (
    <button 
      onClick={handleSendMessage} 
      disabled={isLoadingMessage}
    >
      {isLoadingMessage ? 'Sending...' : 'Ask AI'}
    </button>
  );
}
```

### Load Chat History

```tsx
import { useChatHistory } from '@/hooks/use-chat';

function ChatHistory({ courseId }: { courseId: string }) {
  const { data: history, isLoading } = useChatHistory(courseId);

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div>
      {history?.map((msg, i) => (
        <div key={i}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}
```

### Clear Chat History

```tsx
import { useChat } from '@/hooks/use-chat';

function ClearButton({ courseId }: { courseId: string }) {
  const { clearChatHistory } = useChat();

  const handleClear = async () => {
    await clearChatHistory(courseId);
    // Toast notification shown automatically
  };

  return <button onClick={handleClear}>Clear History</button>;
}
```

### Full Example (Already Implemented in AIAssistant.tsx)

```tsx
import { useChat } from '@/hooks/use-chat';

export function AIAssistant({ courseId, courseTitle }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { sendMessage, isLoadingMessage } = useChat();

  const handleSend = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoadingMessage) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await sendMessage(courseId, userMessage);
      const aiResponse = response.data?.response || 'No response received';
      
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        timestamp: response.data?.timestamp
      }]);
    } catch (error) {
      // Remove failed message
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        disabled={isLoadingMessage}
      />
      <button onClick={() => handleSend()} disabled={isLoadingMessage}>
        Send
      </button>
    </div>
  );
}
```

## API Reference

### `useChat()` Hook

Returns an object with:

- **sendMessage(courseId, message)**: Send a message to AI
  - Returns: `Promise<SendMessageResponse>`
  - Throws: Error if request fails
  - Auto-handles: Enrollment errors (403), network errors

- **getChatHistory(courseId)**: Get all chat messages for a course
  - Returns: `Promise<ChatMessage[]>`
  - Returns empty array on error

- **clearChatHistory(courseId)**: Delete all messages for a course
  - Returns: `Promise<void>`
  - Shows toast on success/error

- **refetchChatHistory(courseId)**: Invalidate and refetch history
  - Useful after manual DB changes

- **isLoadingMessage**: Boolean - true when sending message
- **isLoadingHistory**: Boolean - true when loading history
- **isError**: Boolean - true if error occurred

### `useChatHistory(courseId)` Hook

Standalone hook for loading history with React Query:

```tsx
const { data, isLoading, error, refetch } = useChatHistory(courseId);
```

Returns:
- **data**: `ChatMessage[]` - Array of messages
- **isLoading**: Boolean - Loading state
- **error**: Error object if failed
- **refetch**: Function to manually refetch

## Types

### ChatMessage
```typescript
{
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string | Date;
}
```

### SendMessageResponse
```typescript
{
  success: boolean;
  data: {
    message: string;      // User's message
    response: string;     // AI's response
    timestamp: string;    // ISO timestamp
  };
}
```

## Backend Integration

The hook expects these backend endpoints:

1. **POST /api/chat/ask/:courseId**
   - Body: `{ message: string }`
   - Response: `{ success: true, data: { response: string, ... } }`

2. **GET /api/chat/history/:courseId** (optional)
   - Response: `{ data: ChatMessage[] }`

3. **DELETE /api/chat/history/:courseId** (optional)
   - Response: `{ success: true, message: string }`

All requests automatically include credentials (cookies).

## Error Handling

The hook automatically handles:
- ✅ 403 Enrollment errors → Shows "must be enrolled" toast
- ✅ Network errors → Shows error toast with message
- ✅ Invalid responses → Returns fallback values

## Caching

- Chat history cached for 30 seconds
- Automatically invalidated after sending message
- Manual refetch available via `refetchChatHistory()`

## Example: Integration in Your Component

```tsx
import { useChat } from '@/hooks/use-chat';

export function MyChatComponent({ courseId }: { courseId: string }) {
  const { 
    sendMessage, 
    getChatHistory, 
    isLoadingMessage 
  } = useChat();

  // Load history on mount
  useEffect(() => {
    getChatHistory(courseId).then(setMessages);
  }, [courseId]);

  // Send a message
  const handleAsk = async (question: string) => {
    try {
      const response = await sendMessage(courseId, question);
      console.log('Got answer:', response.data.response);
    } catch {
      console.log('Failed - error already toasted');
    }
  };

  return <YourUI />;
}
```

## Comparison with Direct Axios Calls

### Before (Direct Axios):
```tsx
const response = await axios.post(
  `${import.meta.env.VITE_SERVER_URL}/chat/ask/${courseId}`,
  { message },
  { withCredentials: true }
);
```

### After (Chat Hook):
```tsx
const response = await sendMessage(courseId, message);
```

Benefits:
- ✅ No need to repeat URLs
- ✅ Automatic error handling & toasts
- ✅ Built-in loading states
- ✅ Automatic cache invalidation
- ✅ Type safety
- ✅ Consistent with other hooks (use-courses, use-enroll)
