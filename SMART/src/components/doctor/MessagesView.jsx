import React, { useState, useEffect } from 'react'

export default function MessagesView({ doctor, addToast }) {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchMessages = () => {
    const all = JSON.parse(localStorage.getItem('shs_messages') || '[]');
    const filtered = all.filter(m => m.doctorEmail === doctor.email);
    setMessages(filtered);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    return () => clearInterval(interval);
  }, [doctor]);

  const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
  const myPatientEmails = new Set([
    ...messages.map(m => m.patientEmail),
    ...apps.filter(a => a.doctor.name === doctor.name).map(a => a.email)
  ]);

  const chats = Array.from(myPatientEmails).map(email => {
    const patientMsgs = messages.filter(m => m.patientEmail === email);
    const patientName = patientMsgs[0]?.patientName || apps.find(a => a.email === email)?.patientName || "Patient";
    
    return {
      email,
      name: patientName,
      lastMsg: patientMsgs[patientMsgs.length - 1] || { text: "No messages yet" },
      all: patientMsgs
    };
  });

  const sendReply = (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      doctorEmail: doctor.email,
      patientEmail: selectedChat.email,
      patientName: selectedChat.name,
      sender: 'doctor',
      text: reply,
      time: new Date().toISOString()
    };

    const all = JSON.parse(localStorage.getItem('shs_messages') || '[]');
    const updated = [...all, newMsg];
    localStorage.setItem('shs_messages', JSON.stringify(updated));
    setMessages(updated.filter(m => m.doctorEmail === doctor.email));
    setReply("");
    addToast("Reply sent!", "ok");

    const notifs = JSON.parse(localStorage.getItem('shs_notifications') || '[]');
    notifs.push({
      id: Date.now() + 1,
      to: selectedChat.email,
      msg: `Dr. ${doctor.name} replied to your message.`,
      time: new Date().toISOString(),
      type: 'message'
    });
    localStorage.setItem('shs_notifications', JSON.stringify(notifs));
  };

  return (
    <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: 'calc(100vh - 120px)' }}>
      <div className="card" style={{ background: 'white', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', fontWeight: 700 }}>Chats</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div key={chat.email} onClick={() => setSelectedChat(chat)} style={{
              padding: 16, cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
              background: selectedChat?.email === chat.email ? '#f0f9ff' : 'transparent'
            }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{chat.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.lastMsg.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'white', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', fontWeight: 700 }}>{selectedChat.name}</div>
            <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedChat.all.map(m => (
                <div key={m.id} style={{
                  maxWidth: '70%', padding: '10px 14px', borderRadius: 12, fontSize: 13,
                  alignSelf: m.sender === 'doctor' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'doctor' ? '#0ea5e9' : '#f1f5f9',
                  color: m.sender === 'doctor' ? 'white' : '#1e293b'
                }}>
                  {m.sender === 'patient' && <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4, color: '#0ea5e9' }}>{selectedChat.name}</div>}
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendReply} style={{ padding: 20, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a reply..." style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} />
              <button type="submit" style={{ padding: '0 20px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
