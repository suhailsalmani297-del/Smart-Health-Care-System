import React, { useState, useEffect } from 'react'
import { T } from './Constants'

export default function MessagingView({ user, addToast, externalSelectedDoc }) {
  const [allMessages, setAllMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedChatEmail, setSelectedChatEmail] = useState(externalSelectedDoc?.email || null);

  const fetchMessages = () => {
    const all = JSON.parse(localStorage.getItem('shs_messages') || '[]');
    setAllMessages(all.filter(m => m.patientEmail === user.email));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500); 
    return () => clearInterval(interval);
  }, [user]);

  const chatDoctorsMap = {};
  allMessages.forEach(m => {
    if (!chatDoctorsMap[m.doctorEmail]) {
        const doctors = JSON.parse(localStorage.getItem('shs_doctors') || '[]');
        const d = doctors.find(doc => doc.email === m.doctorEmail);
        chatDoctorsMap[m.doctorEmail] = { email: m.doctorEmail, name: d?.name || "Doctor", msgs: [] };
    }
    chatDoctorsMap[m.doctorEmail].msgs.push(m);
  });

  if (externalSelectedDoc && !chatDoctorsMap[externalSelectedDoc.email]) {
    chatDoctorsMap[externalSelectedDoc.email] = { 
        email: externalSelectedDoc.email, 
        name: externalSelectedDoc.name, 
        msgs: [] 
    };
  }

  const chats = Object.values(chatDoctorsMap);
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
      time: new Date().toISOString()
    };
    
    const all = [...JSON.parse(localStorage.getItem('shs_messages') || '[]'), newMsg];
    localStorage.setItem('shs_messages', JSON.stringify(all));
    setAllMessages(all.filter(m => m.patientEmail === user.email));
    setText("");

    const notifs = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    notifs.push({ 
        id: Date.now()+1, 
        to: selectedChatEmail, 
        msg: `New message from ${user.name}`, 
        time: new Date().toISOString(), 
        type: 'message' 
    });
    localStorage.setItem('shs_notifications', JSON.stringify(notifs));
  };

  return (
    <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:20, height:'calc(100vh - 160px)', background:T.surface, borderRadius:24, boxShadow:T.sh2, border:`1px solid ${T.border}`, overflow:'hidden' }}>
       <div style={{ borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', background: 'rgba(248, 250, 252, 0.5)' }}>
          <div style={{ padding:'24px 20px', borderBottom:`1px solid ${T.border}` }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:0 }}>Conversations</h3>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {chats.length === 0 ? (
                <div style={{ padding:20, textAlign:'center', color:T.muted, fontSize:13 }}>No active chats</div>
            ) : chats.map(c => (
              <div 
                key={c.email} 
                onClick={() => setSelectedChatEmail(c.email)} 
                style={{ 
                    padding:'16px 20px', borderBottom:`1px solid ${T.border}`, cursor:'pointer', 
                    background: selectedChatEmail === c.email ? '#fff' : 'transparent',
                    boxShadow: selectedChatEmail === c.email ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
                    transition:'all 0.2s'
                }}
              >
                <div style={{ fontSize:14, fontWeight:700, color: selectedChatEmail === c.email ? T.blue : T.text, marginBottom:4 }}>Dr. {c.name.split(" ").pop()}</div>
                <div style={{ fontSize:12, color:T.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {c.msgs.length > 0 ? c.msgs[c.msgs.length-1].text : "Click to start chatting"}
                </div>
              </div>
            ))}
          </div>
       </div>

       <div style={{ display:'flex', flexDirection:'column' }}>
          {activeChat ? (
            <>
              <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.border}`, background:'#fff', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:T.blueLt, color:T.blue, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{activeChat.name[0]}</div>
                <div>
                    <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{activeChat.name}</div>
                    <div style={{ fontSize:11, color:T.green, display:'flex', alignItems:'center', gap:4 }}>● Online</div>
                </div>
              </div>
              <div style={{ flex:1, padding:'24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:16, background: 'rgba(241, 245, 249, 0.3)' }}>
                {activeChat.msgs.length === 0 && (
                    <div style={{ textAlign:'center', marginTop:40 }}>
                        <div style={{ fontSize:40, marginBottom:12 }}>👋</div>
                        <h4 style={{ margin:0, color:T.text }}>Say hello to Dr. {activeChat.name.split(" ").pop()}</h4>
                        <p style={{ fontSize:13, color:T.muted }}>Start your consultation by sending a message below.</p>
                    </div>
                )}
                {activeChat.msgs.map(m => (
                  <div key={m.id} style={{ 
                      maxWidth:'70%', padding:'12px 16px', borderRadius:20, fontSize:13.5, 
                      alignSelf: m.sender==='patient'?'flex-end':'flex-start', 
                      background: m.sender==='patient'?T.blue:'#fff', 
                      color: m.sender==='patient'?'#fff':T.text,
                      boxShadow: m.sender==='patient' ? '0 4px 12px rgba(26, 86, 219, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                      border: m.sender==='patient' ? 'none' : `1px solid ${T.border}`
                  }}>
                    {m.text}
                    <div style={{ fontSize:9, marginTop:6, opacity:0.7, textAlign: m.sender==='patient'?'right':'left' }}>
                        {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ padding:'20px 24px', borderTop:`1px solid ${T.border}`, display:'flex', gap:12, background:'#fff' }}>
                <input 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="Type your message here..." 
                    style={{ flex:1, padding:'14px 20px', borderRadius:14, border:`1px solid ${T.border}`, outline:'none', background:'#f8fafc', fontSize:14 }} 
                />
                <button type="submit" style={{ width:48, height:48, background:T.blue, color:'#fff', border:'none', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow: '0 4px 12px rgba(26, 86, 219, 0.3)', transition:'all 0.2s' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:T.muted, gap:12 }}>
                <div style={{ fontSize:50 }}>💬</div>
                <div style={{ fontSize:15, fontWeight:600 }}>Select a consultation to start messaging</div>
            </div>
          )}
       </div>
    </div>
  );
}
