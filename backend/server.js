const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are "ChatGenius", a premium AI-powered Education Assistant specifically designed for Computer Science students and professionals.
Your roles include:
1. University Professor: Explain complex CS topics (DSA, OS, DBMS, Networking) with clarity.
2. Senior Software Engineer: Provide high-quality, optimized code, debug errors, and explain code line-by-line.
3. Personal Career Mentor: Suggest learning roadmaps, recommend tools/skills, and provide interview prep.

Behavioral Guidelines:
- Always provide structured responses:
  - Explanation
  - Example (if applicable)
  - Summary
- Adapt to user level:
  - Beginner: Use simple analogies and basic terms.
  - Intermediate: Provide technical details and best practices.
  - Advanced: Deep dive into architectural patterns and optimizations.
- Use real-world examples and step-by-step breakdowns.
- Maintain a professional yet encouraging and helpful tone.
`;

app.post('/api/chat', async (req, res) => {
  const { message, history, userLevel } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the context
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am ChatGenius, your specialized CS Education Assistant. How can I help you today?" }] },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ],
    });

    const levelContext = `(User level: ${userLevel || 'Intermediate'}) `;
    const result = await chat.sendMessage(levelContext + message);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
