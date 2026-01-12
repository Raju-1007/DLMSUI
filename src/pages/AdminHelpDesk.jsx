import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 



export default function AdminHelpDesk() {
  const { showSuccess, showError } = useMessage();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [currentTicket, setCurrentTicket] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/admin/helpdesk");
      setTickets(res.data || []);
    } catch {
      // fallback
      setTickets([
        {
          id: 1,
          user: "ST123 - Pankaj",
          subject: "Unable to open course",
          message: "When I click course, page not opening.",
          status: "Pending",
          reply: ""
        },
        {
          id: 2,
          user: "ST567 - Dhawan",
          subject: "Assignment error",
          message: "Submit button not working.",
          status: "Pending",
          reply: ""
        }
      ]);
    }
    setLoading(false);
  };

  const openReplyPopup = (ticket) => {
    setCurrentTicket(ticket);
    setReplyMessage(ticket.reply || "");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setReplyMessage("");
    setCurrentTicket(null);
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      showError("Reply cannot be empty");
      return;
    }

    const updated = {
      ...currentTicket,
      reply: replyMessage,
      status: "Replied"
    };

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+`/api/admin/helpdesk/reply`, updated);
      setTickets((prev) =>
        prev.map((t) => (t.id === currentTicket.id ? updated : t))
      );
      showSuccess("Reply sent");
      setMessageData({
        type:"success",
        message:"Reply sent"
      })
    } catch {
      // local update
      setTickets((prev) =>
        prev.map((t) => (t.id === currentTicket.id ? updated : t))
      );
      
      setMessageData({
        type:"error",
        message:"Api faile,Stored on Ui only"
      })
    }

    closePopup();
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_BASE_URL+`/api/admin/helpdesk/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">

          <h2 className="admin-page-title">Admin Help Desk</h2>

          <div className="admin-box">

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Reply</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.user}</td>
                      <td>{t.subject}</td>
                      <td>{t.message}</td>
                      <td>
                        <span className={`status-badge ${t.status === "Replied" ? "green" : "yellow"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{t.reply || "-"}</td>

                      <td>
                        <button className="admin-action-btn edit" onClick={() => openReplyPopup(t)}>
                          Reply
                        </button>
                        <button className="admin-action-btn delete" onClick={() => deleteTicket(t.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>No Tickets Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-header">
              <h3 className="admin-popup-title">Reply to Ticket</h3>
              <span className="admin-popup-close" onClick={closePopup}>✕</span>
            </div>

            <label>Reply Message</label>
            <textarea
              rows={3}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="admin-popup-actions">
              <button className="admin-btn-secondary" onClick={closePopup}>
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={sendReply}>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
