// Backend API Routes for AI Features
// Add these routes to your Express backend

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// AI Study Notes Generator Endpoint
router.post('/generate-notes', authenticateUser, async (req, res) => {
  try {
    const { lessonTitle, lessonContent, courseTitle } = req.body;

    // Using Gemini API (free tier) - replace with your preferred AI service
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    const prompt = `You are an expert educational assistant. Create comprehensive study notes for the following lesson:

Course: ${courseTitle}
Lesson: ${lessonTitle}
Content: ${lessonContent}

Please provide:
1. A clear and concise summary (2-3 paragraphs)
2. 5-7 key points that students should remember
3. 3-5 practice exercises with hints

Format your response as valid JSON with this structure:
{
  "summary": "...",
  "keyPoints": ["point1", "point2", ...],
  "practiceExercises": [
    {"question": "...", "hint": "..."},
    ...
  ]
}`;

    const response = await axios.post(
      `${apiUrl}?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    let notesData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      notesData = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      notesData = {
        summary: aiResponse,
        keyPoints: ['AI-generated content available in summary'],
        practiceExercises: []
      };
    }

    res.json({ notes: notesData });
  } catch (error) {
    console.error('AI Notes Generation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate study notes',
      error: error.message 
    });
  }
});

// AI Code Review Endpoint
router.post('/code-review', authenticateUser, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    const prompt = `You are an expert code reviewer. Analyze this ${language} code and provide detailed feedback:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive code review with:
1. Overall quality score (0-100)
2. List of issues found (bugs, security issues, performance problems)
3. Best practice violations
4. Code strengths
5. Specific improvement suggestions

Format as JSON:
{
  "overallScore": 85,
  "issues": [
    {
      "type": "bug|best-practice|suggestion",
      "severity": "high|medium|low",
      "line": 10,
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`;

    const response = await axios.post(
      `${apiUrl}?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    let reviewData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      reviewData = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch (parseError) {
      // Fallback structure
      reviewData = {
        overallScore: 75,
        issues: [{
          type: 'suggestion',
          severity: 'low',
          message: 'Review completed. Check the detailed feedback.',
          suggestion: aiResponse
        }],
        strengths: ['Code submitted for review'],
        improvements: ['See AI feedback for details']
      };
    }

    res.json({ review: reviewData });
  } catch (error) {
    console.error('AI Code Review Error:', error);
    res.status(500).json({ 
      message: 'Failed to review code',
      error: error.message 
    });
  }
});

export default router;

// Add to your main server file:
// import aiRoutes from './routes/ai.routes.js';
// app.use('/api/ai', aiRoutes);
