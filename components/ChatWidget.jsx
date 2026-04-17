// import React from 'react'
// import { http } from '../api/axios'
// export default function ChatWidget(
//     { roomId='room-helpdesk', userId=1 })
//     { const [open,setOpen]=React.useState(false); 
//         const [msgs,setMsgs]=React.useState([]); const [text,setText]=React.useState(''); React.useEffect(()=>{ if(open) http.get(`/chat/history/${roomId}`).then(r=> setMsgs(r.data||[])) },[open,roomId]); async function send(){ if(!text.trim()) return; await http.post('/chat/send',{roomId,userId,text}); setMsgs(m=>[...m,{roomId,userId,text}]); setText('') } return (<div style={{position:'fixed',right:16,bottom:16}}>{!open && <button className='btn' onClick={()=> setOpen(true)}>💬 Chat</button>}{open && <div className='card' style={{width:320,height:420,display:'flex',flexDirection:'column'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Support</b><button className='btn' onClick={()=> setOpen(false)}>✕</button></div><div style={{flex:1,overflow:'auto',margin:'8px 0'}}>{msgs.map((m,i)=>(<div key={i} className='card' style={{margin:'6px 0'}}><div style={{fontSize:12,opacity:.6}}>User {m.senderId||m.userId}</div><div>{m.text}</div></div>))}</div><div style={{display:'flex',gap:6}}><input value={text} onChange={e=> setText(e.target.value)} placeholder='Type...'/><button className='btn' onClick={send}>Send</button></div></div>}</div>) }



import axios from "axios";
import React, { useEffect, useState } from "react";


export default function ChatWidget({ userId = 1 }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function sendMessage() {
    if (!text.trim()) return;

    try {
    //   const res = await axios.post("http://localhost:8080/chat/chathello", {
    // const res = await axios.post("http://localhost:8080/content/contenthello", {
    const res = await axios.post("http://localhost:8080/notify/notifyhello", {
        name: text
      });

      setMessages((prev) => [
        ...prev,
        {
          userId,
          text: res.data
        }
      ]);

      setText("");
    } catch (err) {
      console.error("POST API failed", err);
      showError("Message send failed");
    }
  }

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16 }}>
      {!open && (
        <button className="btn" onClick={() => setOpen(true)}>
          💬 Chat
        </button>
      )}

      {open && (
        <div
          className="card"
          style={{
            width: 320,
            height: 420,
            display: "flex",
            flexDirection: "column",
            padding: 10
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>Support Chat</b>
            <button className="btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              margin: "10px 0"
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className="card"
                style={{ marginBottom: 6, padding: 6 }}
              >
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  User {m.userId}
                </div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 6 }}>
            <input
              style={{ flex: 1 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
