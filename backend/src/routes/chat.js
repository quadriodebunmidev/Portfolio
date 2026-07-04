const express = require('express');
const router = express.Router();

const DEVELOPER_CONTEXT = `
You are an AI assistant for Odebunmi Quadri's (finesseDev) portfolio website. 
You help visitors learn about Quadri and his work.

About Quadri:
- Full Stack Developer with 3 years of experience
- Alias: finesseDev
- Tech stack: Python, JavaScript, HTML/CSS, React.js, Node.js/Express, WebSocket, Three.js, MongoDB
- Passionate about building scalable web applications and immersive 3D web experiences
- Specializes in full-stack development with a knack for clean, efficient code
- Experience with real-time applications using WebSockets
- Creates interactive 3D experiences with Three.js
- Building RESTful APIs and microservices with Node.js/Express

Answer questions about Quadri's skills, experience, projects, and how to contact him.
Keep responses concise, professional, and friendly. If asked something unrelated to Quadri or web development, politely redirect the conversation.
`;

router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ message: 'Groq API key not configured. Please add GROQ_API_KEY to your .env file.' });
  }

  try {
    const messages = [
      ...history.slice(-8),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: DEVELOPER_CONTEXT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Groq API error');
    
    const reply = data.choices[0].message.content;
    res.json({ reply, role: 'assistant' });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Chat service unavailable: ' + err.message });
  }
});

module.exports = router;
