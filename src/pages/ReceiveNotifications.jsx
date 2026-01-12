import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function ReceiveNotifications() {
  const { showSuccess, showError } = useMessage();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example: logged-in user details
  const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
  const userId = loginDetails?.loginId;
  const role = loginDetails?.role;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/api/admin/notifications"
      );

      // 🔥 Filter logic (ALL / role / specific ID)
     const filtered = res.data.filter(n => {

  // 1️⃣ Show for everyone
  if (n.sendTo === "ALL") return true;

  // 2️⃣ Show ALL student notifications
  if (n.sendTo === "STUDENT") return true;

  // 3️⃣ Show ALL teacher notifications
  if (n.sendTo === "TEACHER") return true;

  // 4️⃣ Show specific student notification
  if (n.sendTo === "STUDENT_ID"){
    return true;
  }

  // 5️⃣ Show specific teacher notification
  if (n.sendTo === "TEACHER_ID" &&
      String(n.userId) === String(userId)) {
    return true;
  }

  return false;
});


      setNotifications(filtered);
    } catch (error) {
     showError("Error loading notifications", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(notifications,"notifications------------------")

  return (
    <div className="rn-page">
      <Navbar />

      <div className="rn-layout">
        <Sidebar />

        <div className="rn-content">
          <h2 className="rn-title">📩 Notifications</h2>

          {loading ? (
            <p className="rn-loading">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="rn-empty">
              No notifications available
            </div>
          ) : (
            <div className="rn-list">
              {notifications.map((n) => (
                <div key={n.id} className="rn-card">
                  <h4 className="rn-card-title">{n.title}</h4>
                  <p className="rn-card-message">{n.message}</p>
                   <p className="rn-card-message">{n.userId}</p>

                  <div className="rn-meta">
                    <span className="rn-badge">{n.sendTo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
