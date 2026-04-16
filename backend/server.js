const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getChatResponse } = require('../models/aiModel');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, history, userLevel } = req.body;

  try {
    const text = await getChatResponse(message, history, userLevel);
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
