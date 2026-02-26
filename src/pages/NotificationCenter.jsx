import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

export default function NotificationCenter() {

  const { showError } = useMessage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const loginstuDetails = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!loginstuDetails?.userDetails?.loginid) return;

    loadNotifications();
  }, [loginstuDetails]);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const studentId = loginstuDetails.userDetails.loginid;

      // 🔹 1️⃣ Specific student notifications
      const specificRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/getStudentNotifications`,
        { params: { studentId } }
      );

      // 🔹 2️⃣ Admin all student notifications
      const allRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/getALLNotifications`,
        { params: { sendTo: "STUDENT" } }
      );

      // 🔹 Normalize Data
      const specificNotifications = (specificRes.data || []).map(n => ({
        id: n.rstudentNotificationId,
        title: n.title,
        content: n.body,
        date: n.date,
      }));

      const adminNotifications = (allRes.data || []).map(n => ({
        id: n.rstudentTeacherNotificationId,
        title: n.title,
        content: n.message,
        date: n.date,
        role:n.role,
      }));

      // Merge both
      setItems([...specificNotifications, ...adminNotifications]);

    } catch (err) {
      showError("Failed to load notifications");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="notify-grid">
        <Sidebar />

        <div className="notifications-wrapper">
          <h2 className="notify-title">Important Notifications</h2>

          <div className="notify-table-box">
            <div className="notify-user-header">
              {loginstuDetails?.userDetails?.fullName} ·{" "}
              <span className="notify-id">
                {loginstuDetails?.userDetails?.loginid}
              </span>
            </div>

            {loading && (
              <div className="notify-empty">
                Loading notifications...
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="notify-empty">
                📭 No Notifications Found
              </div>
            )}

            {!loading && items.length > 0 && (
              <table className="notify-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>whoom</th>
                    <th>Message</th>
                    
                    <th>Action</th>

                  </tr>
                </thead>
                <tbody>
                  {items.map((n) => (
                    <tr key={n.id}>
                      <td>{n.date || "-"}</td>
                      <td>{n.role}</td>

                      <td>
                        <strong>{n.title}</strong>

                        <div className="notify-body">
                          {n.content && n.content.length > 40
                            ? n.content.substring(0, 40) + "..."
                            : n.content}
                        </div>
                      </td>

                            <td>
        <button
          className="notify-view-btn"
          onClick={() => {
            console.log("Clicked:", n);   // 🔍 debug
            setSelectedNotification(n);
          }}
        >
          View
        </button>
      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
     {/* Modal */}
{selectedNotification !== null && (
  <div
    className="notify-modal-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <div
      className="notify-modal"
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        maxWidth: "90%"
      }}
    >

      <div className="notify-modal-header">
        <h3>{selectedNotification?.title}</h3>
        <button
          className="notify-close-btn"
          onClick={() => setSelectedNotification(null)}
        >
          ✖
        </button>
      </div>

      <div className="notify-modal-body">
        {selectedNotification?.content}
      </div>

      <div className="notify-modal-footer">
        <button
          className="notify-modal-ok"
          onClick={() => setSelectedNotification(null)}
        >
          OK
        </button>
      </div>

    </div>
  </div>
)}

      <Footer />
    </div>
  );
}