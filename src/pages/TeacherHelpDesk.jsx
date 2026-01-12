import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherHelpDesk() {
  const { showSuccess, showError } = useMessage();
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Projector not working in Classroom 8A",
      category: "Technical",
      priority: "High",
      status: "Open",
      date: "2025-01-04"
    },
    {
      id: 2,
      subject: "Need updated syllabus approval",
      category: "Academic",
      priority: "Medium",
      status: "In Progress",
      date: "2025-01-02"
    }
  ]);

  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    category: "Technical",
    priority: "Low",
    description: ""
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
      date: new Date().toISOString().slice(0, 10)
    };

    setTickets([...tickets, newTicket]);
    setShowPopup(false);

    setForm({
      subject: "",
      category: "Technical",
      priority: "Low",
      description: ""
    });

    showSuccess("Support Ticket Submitted Successfully!");
  };

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2 className="teacher-page-title">Help Desk</h2>

          <div className="teacher-help-header">
            <button
              className="teacher-btn-primary"
              onClick={() => setShowPopup(true)}
            >
              + Raise Support Ticket
            </button>
          </div>

          <div className="teacher-card">
            <h3 className="teacher-card-title">Your Support Tickets</h3>

            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.subject}</td>
                    <td>{t.category}</td>
                    <td>{t.priority}</td>
                    <td>
                      <span
                        className={`ticket-badge ${
                          t.status === "Resolved"
                            ? "green"
                            : t.status === "In Progress"
                            ? "yellow"
                            : "red"
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

      {/* POPUP */}
      {showPopup && (
        <div className="help-overlay" onClick={() => setShowPopup(false)}>
          <div className="help-popup" onClick={(e) => e.stopPropagation()}>
            <div className="help-popup-header">
              <h3>Raise Support Ticket</h3>
              <span
                className="help-close"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </span>
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
              <option>Classroom Management</option>
              <option>Salary / HR</option>
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe your issue"
            ></textarea>

            <div className="help-popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
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
