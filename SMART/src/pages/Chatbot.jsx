import React, { useState, useRef, useEffect, useCallback } from 'react'

const API = '/api'

const QUICK = [
  { text: 'What is BMI?', icon: '⚖️' },
  { text: 'How to control blood pressure?', icon: '❤️' },
  { text: 'Tips for better sleep', icon: '😴' },
  { text: 'What foods reduce cholesterol?', icon: '🥗' },
  { text: 'How much water should I drink?', icon: '💧' },
  { text: 'Symptoms of diabetes?', icon: '🩺' },
  { text: 'How to boost immunity?', icon: '🛡️' },
  { text: 'Best exercises for back pain?', icon: '🏃' },
]

const CAPABILITIES = [
  { icon: '🩺', label: 'Disease Information', color: '#3b82f6' },
  { icon: '🥗', label: 'Diet & Nutrition', color: '#10b981' },
  { icon: '🏃', label: 'Exercise Guidance', color: '#0ea5e9' },
  { icon: '💊', label: 'Medication FAQs', color: '#8b5cf6' },
  { icon: '🧠', label: 'Mental Health Tips', color: '#f59e0b' },
  { icon: '🛡️', label: 'Disease Prevention', color: '#06b6d4' },
]

function BotAvatar() {
  return (
    <div className="bot-avatar">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="url(#botGrad)" />
        <path d="M22 12H10C8.9 12 8 12.9 8 14v8c0 1.1.9 2 2 2h2l-2 3 6-3h6c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z" fill="white" fillOpacity="0.9"/>
        <circle cx="13" cy="18" r="1.2" fill="url(#botGrad)"/>
        <circle cx="19" cy="18" r="1.2" fill="url(#botGrad)"/>
        <defs>
          <linearGradient id="botGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9"/>
            <stop offset="1" stopColor="#3b82f6"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function PulsingDot({ color }) {
  return <span className="pulsing-dot" style={{ background: color }} />
}

export default function Chatbot() {
  const STORAGE_KEY = 'health_chat_history'

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return [{
      id: 1, role: 'bot',
      text: "Hello! 👋 I'm your Smart Health Assistant. I can help you with questions about nutrition, exercise, disease prevention, medications, and general wellness. How can I assist you today?",
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]
  }

  const [messages, setMessages] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendOnline, setBackendOnline] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [chatSessions, setChatSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chat_sessions') || '[]') } catch { return [] }
  })
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const endRef = useRef(null)
  const messagesRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  // Save messages to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Backend health check
  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(() => setBackendOnline(true)).catch(() => setBackendOnline(false))
  }, [])

  // Scroll visibility
  const handleScroll = () => {
    if (!messagesRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200)
  }

  // Text-to-Speech
  const speakText = (text, msgId) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (isSpeaking === msgId) { setIsSpeaking(null); return }
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_~`]/g, ''))
      utterance.rate = 0.95
      utterance.pitch = 1.05
      utterance.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
      if (preferred) utterance.voice = preferred
      utterance.onstart = () => setIsSpeaking(msgId)
      utterance.onend = () => setIsSpeaking(null)
      utterance.onerror = () => setIsSpeaking(null)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Voice Input (Speech-to-Text)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        setIsListening(false)
        setTimeout(() => sendMessage(transcript), 300)
      }
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  // Save session to history
  const saveSessionToHistory = (msgs) => {
    if (msgs.length <= 1) return
    const session = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      preview: msgs.find(m => m.role === 'user')?.text || 'Chat session',
      messages: msgs,
      count: msgs.length,
    }
    const updated = [session, ...chatSessions].slice(0, 10)
    setChatSessions(updated)
    try { localStorage.setItem('chat_sessions', JSON.stringify(updated)) } catch {}
  }

  const sendMessage = async (text) => {
    const userMsg = typeof text === 'string' ? text.trim() : input.trim()
    if (!userMsg) return
    setInput('')
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const userEntry = { id: Date.now(), role: 'user', text: userMsg, time: now }
    setMessages(m => [...m, userEntry])
    setLoading(true)
    try {
      const res = await fetch(`${API}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      const reply = data.response || data.error || 'Sorry, I could not process that request.'
      const botEntry = { id: Date.now() + 1, role: 'bot', text: reply, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(m => [...m, botEntry])
    } catch (err) {
      console.error('Chatbot fetch error:', err)
      const botEntry = {
        id: Date.now() + 1, role: 'bot',
        text: "⚠️ I can't connect to the backend right now. Please ensure the Flask server is running on port 5000.\n\nIn the meantime, here's a general health tip: **Stay hydrated** — drink 8–10 glasses of water daily, sleep 7–8 hours, and exercise at least 30 minutes daily for good health! 🌿",
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(m => [...m, botEntry])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => {
    saveSessionToHistory(messages)
    setMessages([{
      id: Date.now(), role: 'bot',
      text: "Chat cleared! 👋 I'm here to help with any health questions. What would you like to know?",
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  const loadSession = (session) => {
    setMessages(session.messages)
    setShowHistory(false)
  }

  const deleteSession = (id, e) => {
    e.stopPropagation()
    const updated = chatSessions.filter(s => s.id !== id)
    setChatSessions(updated)
    try { localStorage.setItem('chat_sessions', JSON.stringify(updated)) } catch {}
  }

  return (
    <div className="cb-page">
      {/* Header */}
      <div className="cb-page-header">
        <div className="cb-header-left">
          <div className="cb-header-icon">🏥</div>
          <div>
            <h2 className="cb-page-title">Your Health Assistant</h2>
            <p className="cb-page-sub">Ask anything about health, nutrition, exercise, or disease prevention</p>
          </div>
        </div>
        <div className="cb-header-right">
          <button className="cb-history-toggle" onClick={() => setShowHistory(!showHistory)}>
            📋 History {chatSessions.length > 0 && <span className="hist-badge">{chatSessions.length}</span>}
          </button>
          <div className={`cb-status ${backendOnline === true ? 'online' : backendOnline === false ? 'offline' : 'checking'}`}>
            <PulsingDot color={backendOnline === true ? '#22c55e' : backendOnline === false ? '#ef4444' : '#f59e0b'} />
            {backendOnline === true ? 'Chats' : backendOnline === false ? 'Offline Mode' : 'Connecting...'}
          </div>
        </div>
      </div>

      <div className="cb-layout">
        {/* Chat Window */}
        <div className="cb-window">
          {/* Toolbar */}
          <div className="cb-toolbar">
            <div className="cb-tb-left">
              <BotAvatar />
              <div>
                <div className="cb-tb-name">Health Assistant</div>
                <div className="cb-tb-sub">
                </div>
              </div>
            </div>
            <div className="cb-tb-actions">
              <button className="cb-action-btn" title="Export chat" onClick={() => {
                const txt = messages.map(m => `[${m.time}] ${m.role === 'bot' ? 'Assistant' : 'You'}: ${m.text}`).join('\n')
                const a = document.createElement('a')
                a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt)
                a.download = 'health-chat.txt'
                a.click()
              }}>📤</button>
              <button className="cb-action-btn cb-clear" onClick={clearChat} title="Clear chat">🗑️ Clear</button>
            </div>
          </div>

          {/* Messages */}
          <div className="cb-messages" ref={messagesRef} onScroll={handleScroll}>
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`cb-msg ${msg.role}`} style={{ animationDelay: `${idx * 0.03}s` }}>
                {msg.role === 'bot' && <BotAvatar />}
                <div className="cb-bubble-wrap">
                  <div className="cb-bubble">
                    <div className="cb-text">{msg.text}</div>
                    <div className="cb-msg-footer">
                      <span className="cb-time">{msg.time}</span>
                      {msg.role === 'bot' && (
                        <div className="cb-msg-actions">
                          <button
                            className={`cb-speak-btn ${isSpeaking === msg.id ? 'speaking' : ''}`}
                            onClick={() => speakText(msg.text, msg.id)}
                            title={isSpeaking === msg.id ? 'Stop speaking' : 'Read aloud'}
                          >
                            {isSpeaking === msg.id ? '🔇' : '🔊'}
                          </button>
                          <button className="cb-copy-btn" onClick={() => navigator.clipboard.writeText(msg.text)} title="Copy">📋</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="user-avatar">👤</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="cb-msg bot">
                <BotAvatar />
                <div className="cb-bubble cb-typing">
                  <span className="typing-label">Thinking</span>
                  <span className="dot-1" /><span className="dot-2" /><span className="dot-3" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {showScrollBtn && (
            <button className="scroll-to-bottom" onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              ↓
            </button>
          )}

          {/* Input Area - Full width & reduced height */}
          <div className="cb-input-area">
            <div className="cb-input-wrap">
              <textarea
                ref={inputRef}
                className="cb-input"
                placeholder={isListening ? '🎙️ Listening...' : 'Type your health question...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <div className="cb-input-actions">
                <button
                  className={`cb-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                  disabled={loading}
                >
                  {isListening ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  )}
                </button>
                <button
                  className="cb-send"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  title="Send message"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="cb-sidebar">
          {/* Chat History Panel - always visible beside chat */}
          {showHistory && (
            <div className="cb-card history-panel">
              <div className="cb-card-head">
                <span>📋 Chat History</span>
                <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
              </div>
              {chatSessions.length === 0 ? (
                <div className="no-history">No saved sessions yet.<br/>Clear chat to save current session.</div>
              ) : (
                <div className="history-list">
                  {chatSessions.map(session => (
                    <div key={session.id} className="history-item" onClick={() => loadSession(session)}>
                      <div className="history-meta">
                        <span className="history-date">📅 {session.date}</span>
                        <button className="history-delete" onClick={(e) => deleteSession(session.id, e)}>✕</button>
                      </div>
                      <div className="history-preview">{session.preview?.slice(0, 60)}...</div>
                      <div className="history-count">{session.count} messages</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Questions */}
          <div className="cb-card">
            <div className="cb-card-head">💬 Quick Questions</div>
            <div className="cb-quick-list">
              {QUICK.map((q, i) => (
                <button
                  key={i}
                  className="cb-quick-btn"
                  onClick={() => sendMessage(q.text)}
                  disabled={loading}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="q-icon">{q.icon}</span>
                  <span>{q.text}</span>
                  <span className="q-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="cb-card">
            <div className="cb-card-head">ℹ️ What I Can Help With</div>
            <div className="cb-info-grid">
              {CAPABILITIES.map((item, i) => (
                <div className="cb-info-item" key={i} style={{ '--item-color': item.color }}>
                  <span className="info-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <p className="cb-disclaimer">
              ⚕️ This chatbot provides general health information only. Always consult a qualified doctor for personal medical advice.
            </p>
          </div>

          {/* Voice Features Card - REMOVED as requested */}
        </div>
      </div>

      <style jsx>{`
        .cb-page {
          max-width: 1600px;
          margin: 0 auto;
          padding: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #eef5ff 0%, #e6f0fa 100%);
          min-height: 100vh;
          position: relative;
          overflow-y: auto;
        }

        .cb-page::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(14,165,233,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .cb-page > * { position: relative; z-index: 1; }

        /* Header */
        .cb-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
          animation: fadeInDown 0.7s ease-out;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cb-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cb-header-icon {
          font-size: 3rem;
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }

        .cb-page-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.5px;
          margin: 0 0 0.1rem;
        }

        .cb-page-sub {
          color: #2c3e66;
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
        }

        .cb-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cb-history-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cb-history-toggle:hover {
          border-color: #3b82f6;
          background: #eff6ff;
          transform: translateY(-1px);
        }

        .hist-badge {
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 50px;
        }

        .cb-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-weight: 700;
          font-size: 0.8rem;
          background: white;
          border: 1px solid #e2e8f0;
        }

        .cb-status.online { background: #f0fdf4; color: #16a34a; }
        .cb-status.offline { background: #fef2f2; color: #ef4444; }
        .cb-status.checking { background: #fffbeb; color: #d97706; }

        .pulsing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          animation: pulse-anim 1.5s ease-in-out infinite;
        }

        @keyframes pulse-anim {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        /* Layout */
        .cb-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.2rem;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Chat Window */
        .cb-window {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 1px solid #d9e8f5;
        }

        /* Toolbar */
        .cb-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.5rem;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          border-bottom: 1px solid #2563eb;
        }

        .cb-tb-left {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          animation: float 4s ease-in-out infinite;
          box-shadow: 0 2px 10px rgba(14,165,233,0.4);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .cb-tb-name {
          font-size: 1rem;
          font-weight: 800;
          color: white;
        }

        .cb-tb-sub {
          font-size: 0.7rem;
          color: #b9d9f0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .tb-dot {
          width: 7px;
          height: 7px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse-anim 1.5s infinite;
        }

        .cb-tb-actions {
          display: flex;
          gap: 0.6rem;
        }

        .cb-action-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 0.4rem 0.9rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cb-action-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        .cb-clear {
          background: rgba(239,68,68,0.2) !important;
          border-color: rgba(239,68,68,0.4) !important;
        }

        /* Messages */
        .cb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          background: linear-gradient(120deg, #f8fafc, #eff6ff, #f0fdf4, #eef2ff);
          background-size: 300% 300%;
          animation: chatGradient 10s ease infinite;
          scroll-behavior: smooth;
          max-height: 520px;
        }

        @keyframes chatGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .cb-messages::-webkit-scrollbar { width: 4px; }
        .cb-messages::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 10px; }
        .cb-messages::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }

        .cb-msg {
          display: flex;
          gap: 0.8rem;
          align-items: flex-end;
          animation: msgPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes msgPop {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .cb-msg.user {
          flex-direction: row-reverse;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }

        .cb-bubble-wrap { max-width: 76%; }

        .cb-bubble {
          padding: 0.7rem 1.1rem;
          border-radius: 20px;
          line-height: 1.5;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .cb-msg.bot .cb-bubble {
          background: white;
          color: #1e293b;
          border: 1px solid #dce7f2;
          border-bottom-left-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }

        .cb-msg.user .cb-bubble {
          background: linear-gradient(115deg, #0ea5e9, #3b82f6);
          color: white;
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
        }

        .cb-text { white-space: pre-wrap; word-break: break-word; }

        .cb-msg-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.4rem;
          gap: 0.5rem;
        }

        .cb-time {
          font-size: 0.65rem;
          opacity: 0.6;
          font-weight: 600;
        }

        .cb-msg-actions {
          display: flex;
          gap: 0.3rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .cb-bubble:hover .cb-msg-actions { opacity: 1; }

        .cb-speak-btn, .cb-copy-btn {
          background: #eef2ff;
          border: none;
          border-radius: 20px;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          cursor: pointer;
          transition: 0.15s;
        }

        .cb-speak-btn:hover, .cb-copy-btn:hover {
          background: #d9e6f5;
          transform: scale(1.05);
        }

        .cb-speak-btn.speaking {
          background: #3b82f6;
          color: white;
          animation: pulse-anim 0.8s infinite;
        }

        /* Typing */
        .cb-typing {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem !important;
          background: white !important;
        }

        .typing-label {
          font-size: 0.75rem;
          color: #3b82f6;
          font-weight: 600;
        }

        .dot-1, .dot-2, .dot-3 {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          display: inline-block;
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Scroll button */
        .scroll-to-bottom {
          position: absolute;
          bottom: 100px;
          right: 25px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          color: white;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(14,165,233,0.5);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .scroll-to-bottom:hover { transform: scale(1.1); }

        /* Input Area - Full width & reduced height */
        .cb-input-area {
          padding: 0.7rem 1.2rem 0.9rem;
          background: white;
          border-top: 1px solid #e2edf7;
        }

        .cb-input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 0.6rem;
          background: #f5f9ff;
          border: 1.5px solid #d4e2f0;
          border-radius: 48px;
          padding: 0.3rem 0.5rem 0.3rem 1rem;
          transition: all 0.2s ease;
          width: 100%; /* full width */
        }

        .cb-input-wrap:focus-within {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
        }

        .cb-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          padding: 0.4rem 0.2rem;
          outline: none;
          resize: none;
          max-height: 70px; /* reduced height */
          line-height: 1.4;
          font-weight: 500;
        }

        .cb-input::placeholder { color: #94a3b8; }

        .cb-input-actions {
          display: flex;
          gap: 0.4rem;
          align-items: center;
          flex-shrink: 0;
        }

        .cb-mic-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #eef2ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #2563eb;
        }

        .cb-mic-btn svg { width: 18px; height: 18px; }

        .cb-mic-btn:hover:not(:disabled) {
          background: #d9e6f5;
          transform: scale(1.05);
        }

        .cb-mic-btn.listening {
          background: #dc2626;
          color: white;
          animation: pulse-anim 1s infinite;
        }

        .cb-send {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(59,130,246,0.4);
        }

        .cb-send svg { width: 18px; height: 18px; }

        .cb-send:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(59,130,246,0.5);
        }

        .cb-send:disabled { opacity: 0.4; cursor: not-allowed; }

        .cb-input-hint {
          font-size: 0.68rem;
          color: #5b6e8c;
          text-align: center;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        /* Sidebar */
        .cb-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }

        .cb-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid #dce9f2;
          transition: 0.2s;
        }

        .cb-card:hover {
          box-shadow: 0 8px 25px rgba(59,130,246,0.1);
        }

        .cb-card-head {
          padding: 0.8rem 1.2rem;
          border-bottom: 1px solid #e9f0f5;
          background: #fafdff;
          font-weight: 800;
          color: #1e293b;
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 20px;
          padding: 0.2rem 0.6rem;
        }
        .close-btn:hover { background: #eef2ff; color: #ef4444; }

        /* Quick list */
        .cb-quick-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1rem;
        }

        .cb-quick-btn {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 1rem;
          border: 1px solid #e2edf7;
          border-radius: 40px;
          background: white;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cb-quick-btn:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #3b82f6;
          transform: translateX(5px);
        }

        .q-icon { font-size: 1.1rem; }
        .q-arrow { margin-left: auto; opacity: 0; transition: 0.2s; }
        .cb-quick-btn:hover .q-arrow { opacity: 1; transform: translateX(3px); }

        /* Capabilities */
        .cb-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
          padding: 1rem;
        }

        .cb-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.7rem;
          background: #f8fcff;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
          text-align: center;
          transition: 0.2s;
          border: 1px solid transparent;
          cursor: default;
        }

        .cb-info-item:hover {
          border-color: var(--item-color, #3b82f6);
          background: white;
          transform: translateY(-2px);
        }

        .info-icon { font-size: 1.4rem; }

        .cb-disclaimer {
          margin: 0 1rem 1rem;
          padding: 0.7rem;
          background: #fefce8;
          border-radius: 16px;
          font-size: 0.7rem;
          color: #b45309;
          font-weight: 500;
          border: 1px solid #fde68a;
        }

        /* History panel */
        .history-panel .history-list {
          max-height: 280px;
          overflow-y: auto;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .history-item {
          background: #fafdff;
          border-radius: 14px;
          padding: 0.7rem;
          border: 1px solid #e2edf7;
          cursor: pointer;
          transition: 0.2s;
        }

        .history-item:hover {
          background: #eff6ff;
          border-color: #93c5fd;
        }

        .history-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 0.3rem;
        }

        .history-delete {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-weight: bold;
        }
        .history-delete:hover { color: #ef4444; }

        .history-preview {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }

        .history-count {
          font-size: 0.65rem;
          color: #6c8cb0;
        }

        .no-history {
          padding: 1.5rem;
          text-align: center;
          color: #6c8cb0;
          font-size: 0.8rem;
        }

        @media (max-width: 900px) {
          .cb-layout { grid-template-columns: 1fr; }
          .cb-messages { max-height: 420px; }
          .cb-page { padding: 1rem; }
        }
      `}</style>
    </div>
  )
}