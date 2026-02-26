import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";

export default function AdminNotifications() {

  const login = useSelector((state) => state.auth.user);
  const { showSuccess, showError } = useMessage();

  const [items, setItems] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    title: "",
    message: "",
    sendTo: "ALL",
    teacherId: "",
    teacherName: "",
    districtId: "",
    mandalId: "",
    villageId: ""
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadNotifications();
    loadTeacherMeetings();
  }, [page]);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/getALLNotifications`,
        {
          params: {
            sendTo: "ALL",
            page: page,
            size: size
          }
        }
      );

      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      showError("Failed to load notifications");
      setItems([]);
    }
  };

  const loadTeacherMeetings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/getStudentMeetings`, {
          params: {
            
            page: page,
            size: size
          }
        }
          
        
      );
      setMeetings(res.data.content || []);
      setTotalPages(res.data.totalPages);
    } catch {
      setMeetings([]);
    }
  };

  /* ================= SAVE ================= */

  const saveNotification = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      showError("Title & Message required");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/sendAdminNotifications`,
        {
          ...form,
          adminId: login?.userDetails?.loginid,
          role: login?.userDetails?.role,
          fullName: login?.userDetails?.fullName
        }
      );

      showSuccess("Notification Sent");
      setShowPopup(false);
      setPage(0);
      loadNotifications();

    } catch {
      showError("Error saving notification");
    }
  };

  const filteredNotifications = items.filter(n =>
    `${n.title} ${n.message} ${n.sendTo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">

          <h2 className="admin-page-title">Admin Notifications</h2>

          <div className="admin-box">

            <div className="admin-top-row">
              <button className="admin-btn-primary" onClick={() => setShowPopup(true)}>
                + Create Notification
              </button>

              <input
                className="admin-search"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Send To</th>
                  <th>Teacher ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotifications.map(n => (
                  <tr key={n.rstudentTeacherNotificationId}>
                    <td>{n.title}</td>
                    <td>{n.message}</td>
                    <td>{n.sendTo}</td>
                    <td>{n.teacherId || "-"}</td>
                    <td>{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
           
          </div>

          {/* ================= MEETINGS ================= */}

          <h2 className="admin-page-title" style={{ marginTop: "40px" }}>
            Teacher Scheduled Meetings
          </h2>

          <div className="admin-box">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {meetings.map(m => (
                  <tr key={m.id}>
                    <td>{m.teacherId}</td>
                    <td>{m.className}</td>
                    <td>{m.date}</td>
                    <td>{m.startTime}</td>
                    <td>{m.endTime}</td>
                    <td>{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           <div className="admin-pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>


        </div>
        
      </div>

      <Footer />
    </div>
  );
}