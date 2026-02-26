// import React from 'react'
// import Navbar from '../components/Navbar'; import Sidebar from '../components/Sidebar'; import ChatWidget from '../components/ChatWidget'
// export default function HelpDesk(){ return (<div><Navbar/><div style={{display:'grid',gridTemplateColumns:'220px 1fr'}}><Sidebar/><div style={{padding:16}}><h2>Help Desk</h2><div className='card'>Open the chat widget at bottom-right to contact support.</div></div></div><ChatWidget/></div>) }



import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWidget from "../components/ChatWidget";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext"; 
import { Row, Col } from "react-bootstrap";

export default function  HelpDesk() {
  const { showSuccess, showError } = useMessage();
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Unable to access Maths assignment",
      category: "Technical",
      priority: "Medium",
      status: "Open",
      date: "2025-01-03",
    },
    {
      id: 2,
      subject: "Need clarification on Chapter 6 notes",
      category: "Academic",
      priority: "Low",
      status: "Resolved",
      date: "2025-01-01",
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    category: "Technical",
    priority: "Low",
    description: "",
  });

  const submitTicket = () => {
    if (!form.subject || !form.description) {
      showError("Please fill all fields");
      return;
    }

    const newTicket = {
      id: Date.now(),
      ...form,
      status: "Open",
      date: new Date().toISOString().slice(0, 10),
    };

    setTickets([...tickets, newTicket]);
    setShowPopup(false);

    setForm({
      subject: "",
      category: "Technical",
      priority: "Low",
      description: "",
    });

    showSuccess("Ticket submitted successfully!");
  };

  return (
    <div>
      <Navbar />

      <div className="student-layout">
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="student-main">
          <Row>
            <Col lg={6} md={6} sm={12} className="sndsknkn">
              <h2 className="student-page-title">Help Desk</h2>
            </Col>
          </Row>
          {/* TICKETS TABLE */}
          <div className="student-card">
            <Row className="SJNDJNFJS">
              <Col lg={6} md={6} sm={12}>
                <h3 className="student-card-title">Your Tickets</h3></Col>
              <Col lg={6} md={6} sm={12} className="student-help-header text-end">
                <button className="student-btn-primary" onClick={() => setShowPopup(true)}>
                  Raise New Ticket
                </button>
              </Col>
            </Row>
            <div className="sdjnfjsn">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody className="studentsdlkfs">
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.subject}</td>
                    <td>{t.category}</td>
                    <td>{t.priority}</td>
                    <td className="textcolojsnkdj">
                      <span
                        className={`ticket-badge ${
                          t.status === "Resolved" ? "green" : "yellow"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="help-overlay" onClick={() => setShowPopup(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>Raise Support Ticket</h3>
              <span className="help-close" onClick={() => setShowPopup(false)}>✕</span>
            </div>

            <label>Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Enter issue subject"
            />

            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Technical</option>
              <option>Academic</option>
              <option>Fee Related</option>
              <option>General Query</option>
            </select>

            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your issue"
            ></textarea>

            <div className="help-popup-actions">
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={submitTicket}>
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

       {/* <ChatWidget /> */}
      <Footer />
    </div>
  );
}
