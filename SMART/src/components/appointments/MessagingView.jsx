import React, { useState, useEffect, useRef } from 'react'
import { T } from './Constants'

export default function MessagingView({ user, addToast, externalSelectedDoc }) {
  const [allMessages, setAllMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedChatEmail, setSelectedChatEmail] = useState(externalSelectedDoc?.email || null);
  const [searchChat, setSearchChat] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = () => {
    const all = JSON.parse(localStorage.getItem('shs_messages') || '[]');
    setAllMessages(all.filter(m => m.patientEmail === user.email));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); // Real-time updates every 1 second
    return () => clearInterval(interval);
  }, [user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const chatDoctorsMap = {};
  allMessages.forEach(m => {
    if (!chatDoctorsMap[m.doctorEmail]) {
        const doctors = JSON.parse(localStorage.getItem('shs_doctors') || '[]');
        const d = doctors.find(doc => doc.email === m.doctorEmail);
        chatDoctorsMap[m.doctorEmail] = { email: m.doctorEmail, name: d?.name || "Doctor", avatar: d?.name?.charAt(0).toUpperCase() || "D", msgs: [], isOnline: Math.random() > 0.5 };
    }
    chatDoctorsMap[m.doctorEmail].msgs.push(m);
  });

  if (externalSelectedDoc && !chatDoctorsMap[externalSelectedDoc.email]) {
    chatDoctorsMap[externalSelectedDoc.email] = { 
        email: externalSelectedDoc.email, 
        name: externalSelectedDoc.name,
        avatar: externalSelectedDoc.name?.charAt(0).toUpperCase() || "D",
        msgs: [],
        isOnline: true
    };
  }

  const chats = Object.values(chatDoctorsMap);
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchChat.toLowerCase()));
  const activeChat = chats.find(c => c.email === selectedChatEmail);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedChatEmail) return;
    
    const newMsg = {
      id: Date.now(),
      patientEmail: user.email,
      patientName: user.name,
      doctorEmail: selectedChatEmail,
      sender: 'patient',
      text,
      time: new Date().toISOString(),
      status: 'sent' // Message status: sent, delivered, read
    };
    
    const all = [...JSON.parse(localStorage.getItem('shs_messages') || '[]'), newMsg];
    localStorage.setItem('shs_messages', JSON.stringify(all));
    setAllMessages(all.filter(m => m.patientEmail === user.email));
    setText("");
    addToast("Message sent", "ok");

    const notifs = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    notifs.push({ 
        id: Date.now()+1, 
        to: selectedChatEmail, 
        msg: `💬 New message from ${user.name}`, 
        time: new Date().toISOString(), 
        type: 'message',
        read: false 
    });
    localStorage.setItem('shs_notifications', JSON.stringify(notifs));
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20, height:'calc(100vh - 160px)', background:T.surface, borderRadius:24, boxShadow:T.sh2, border:`1px solid ${T.border}`, overflow:'hidden' }}>
       {/* Chat List Sidebar */}
       <div style={{ borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', background: 'rgba(248, 250, 252, 0.5)' }}>
          <div style={{ padding:'20px 16px', borderBottom:`1px solid ${T.border}` }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:'0 0 12px 0' }}>💬 Messages</h3>
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              style={{ width:'100%', padding:'10px 12px', borderRadius:12, border:`1px solid ${T.border}`, fontSize:13, outline:'none', background:'white' }}
            />
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filteredChats.length === 0 ? (
                <div style={{ padding:20, textAlign:'center', color:T.muted, fontSize:13 }}>
                  {searchChat ? '❌ No conversations found' : '💬 Start a conversation to message'}
                </div>
            ) : filteredChats.map(c => (
              <div 
                key={c.email} 
                onClick={() => setSelectedChatEmail(c.email)} 
                style={{ 
                    padding:'14px 16px', borderBottom:`1px solid ${T.border}`, cursor:'pointer', 
                    background: selectedChatEmail === c.email ? '#fff' : 'transparent',
                    boxShadow: selectedChatEmail === c.email ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
                    transition:'all 0.2s'
                }}
              >
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{
                    width:44, height:44, borderRadius:'50%', background:T.blueLt, color:T.blue,
                    display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16,
                    position:'relative', flexShrink:0
                  }}>
                    {c.avatar}
                    {c.isOnline && <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, background:'#22c55e', borderRadius:'50%', border:'2px solid white' }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color: selectedChatEmail === c.email ? T.blue : T.text, marginBottom:4 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize:12, color:T.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {c.msgs.length > 0 ? c.msgs[c.msgs.length-1].text : "Click to start"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
       </div>

       {/* Chat Window */}
       <div style={{ display:'flex', flexDirection:'column' }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div style={{ padding:'16px 24px', borderBottom:`1px solid ${T.border}`, background:'#fff', display:'flex', alignItems:'center', gap:12, justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:T.blueLt, color:T.blue, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, position:'relative' }}>
                    {activeChat.avatar}
                    {activeChat.isOnline && <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, background:'#22c55e', borderRadius:'50%', border:'2px solid white' }} />}
                  </div>
                  <div>
                      <div style={{ fontSize:15, fontWeight:800, color:T.text }}>Dr. {activeChat.name}</div>
                      <div style={{ fontSize:11, color: activeChat.isOnline ? '#22c55e' : T.muted, display:'flex', alignItems:'center', gap:4, fontWeight:600 }}>
                        ● {activeChat.isOnline ? 'Active now' : 'Offline'}
                      </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${T.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📞</button>
                  <button style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${T.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>⋮</button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, padding:'20px 24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:12, background: 'rgba(241, 245, 249, 0.3)' }}>
                {activeChat.msgs.length === 0 && (
                    <div style={{ textAlign:'center', marginTop:'60px' }}>
                        <div style={{ fontSize:48, marginBottom:12 }}>👋</div>
                        <h4 style={{ margin:0, color:T.text, fontSize:16, fontWeight:700 }}>Say hello to Dr. {activeChat.name.split(" ").pop()}</h4>
                        <p style={{ fontSize:13, color:T.muted, marginTop:6 }}>Start your consultation by sending a message below.</p>
                    </div>
                )}
                {activeChat.msgs.map((m, idx) => {
                  const showDate = idx === 0 || formatDate(activeChat.msgs[idx-1].time) !== formatDate(m.time);
                  return (
                    <div key={m.id}>
                      {showDate && (
                        <div style={{ textAlign:'center', margin:'12px 0', fontSize:12, color:T.muted }}>
                          {formatDate(m.time)}
                        </div>
                      )}
                      <div style={{ 
                          maxWidth:'70%', padding:'12px 16px', borderRadius: m.sender === 'patient' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
                          fontSize:13.5, 
                          alignSelf: m.sender==='patient'?'flex-end':'flex-start', 
                          background: m.sender==='patient'?T.blue:'#fff', 
                          color: m.sender==='patient'?'#fff':T.text,
                          boxShadow: m.sender==='patient' ? '0 2px 8px rgba(26, 86, 219, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
                          border: m.sender==='patient' ? 'none' : `1px solid ${T.border}`,
                          wordWrap:'break-word',
                          lineHeight:'1.4'
                      }}>
                        <div style={{ marginBottom:6 }}>{m.text}</div>
                        <div style={{ fontSize:11, opacity:0.7, display:'flex', alignItems:'center', gap:6, justifyContent: m.sender==='patient'?'flex-end':'flex-start' }}>
                            <span>{formatTime(m.time)}</span>
                            {m.sender==='patient' && (
                              <span title={m.status || 'sent'}>
                                {m.status === 'read' ? '✓✓' : m.status === 'delivered' ? '✓✓' : '✓'}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} style={{ padding:'16px 24px', borderTop:`1px solid ${T.border}`, display:'flex', gap:12, background:'#fff', alignItems:'flex-end' }}>
                <button type="button" style={{ width:40, height:40, background:T.blueLt, color:T.blue, border:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, flexShrink:0 }}>+</button>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  <textarea 
                      value={text} 
                      onChange={e => setText(e.target.value)} 
                      placeholder="Type your message..." 
                      rows="1"
                      style={{ flex:1, padding:'12px 16px', borderRadius:20, border:`1px solid ${T.border}`, outline:'none', background:'#f8fafc', fontSize:14, fontFamily:'inherit', resize:'none', maxHeight:100 }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                  />
                </div>
                <button type="submit" style={{ width:40, height:40, background:T.blue, color:'#fff', border:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow: `0 4px 12px rgba(26, 86, 219, 0.3)`, transition:'all 0.2s', flexShrink:0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:T.muted, gap:12 }}>
                <div style={{ fontSize:50 }}>💬</div>
                <div style={{ fontSize:15, fontWeight:600 }}>Select a doctor to start messaging</div>
                <p style={{ fontSize:13, maxWidth:300, textAlign:'center' }}>Choose a doctor from your appointments to send a message. Instant communication for your health needs!</p>
            </div>
          )}
       </div>
    </div>
  );
}
