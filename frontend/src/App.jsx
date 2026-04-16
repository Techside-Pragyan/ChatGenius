import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, 
  Terminal, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Cpu, 
  Settings, 
  User, 
  Bot,
  Hash,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hello! I am **ChatGenius**, your AI-powered Computer Science mentor. Whether you want to master Data Structures, debug a tricky script, or plan your path to becoming a Senior Engineer, I am here to help. What are we learning today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLevel, setUserLevel] = useState('Intermediate');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: input,
        history: messages,
        userLevel: userLevel
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please ensure the backend is running and your API key is configured.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { icon: <BookOpen size={16} />, text: 'Explain Quicksort simply' },
    { icon: <Code2 size={16} />, text: 'Debug my Python snippet' },
    { icon: <Briefcase size={16} />, text: 'Full Stack Roadmap 2024' },
    { icon: <Cpu size={16} />, text: 'What is OS Paging?' }
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Terminal size={32} />
          <span>ChatGenius</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <Hash size={20} />
            <span>General Learning</span>
          </div>
          <div className="nav-item">
            <Code2 size={20} />
            <span>Coding Playground</span>
          </div>
          <div className="nav-item">
            <Briefcase size={20} />
            <span>Career Path</span>
          </div>
          <div className="nav-item">
            <BookOpen size={20} />
            <span>Study Guides</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="user-profile">
            <div className="nav-item">
              <User size={20} />
              <span>Guest Learner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        <header className="chat-header">
          <div className="header-info">
            <h2>CS Knowledge Base</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>AI Mentor • Optimized for Learning</p>
          </div>
          <div className="header-actions">
            <select 
              value={userLevel} 
              onChange={(e) => setUserLevel(e.target.value)}
              style={{
                background: 'var(--secondary-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.4rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </header>

        <div className="messages-container">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`message ${msg.role}`}
              >
                <div className="message-icon">
                  {msg.role === 'ai' ? <Bot size={20} color="var(--accent-color)" /> : <User size={20} />}
                </div>
                <div className="message-content">
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message ai typing"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>Genius is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-prompts-container" style={{ padding: '0 2rem', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {quickPrompts.map((prompt, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="quick-prompt" 
                onClick={() => setInput(prompt.text)}
                style={{
                  background: 'var(--secondary-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  flex: 1,
                  transition: 'background-color 0.2s'
                }}
              >
                {prompt.icon}
                <span style={{ fontSize: '0.85rem', textAlign: 'left' }}>{prompt.text}</span>
              </motion.button>
            ))}
          </div>
        )}

        <div className="input-container">
          <form className="input-box" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask anything about CS, Code, or Careers..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            Press Enter to ask. ChatGenius can make mistakes. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
