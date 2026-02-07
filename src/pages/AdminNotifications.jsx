import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";

export default function AdminNotifications() {

  const { showSuccess, showError } = useMessage();

  const [items, setItems] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userIds, setUserIds] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    message: "",
    sendTo: "ALL",
    userId: ""
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadNotifications();
    loadTeacherMeetings();
  }, []);

  const loadNotifications = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications`
    );
    setItems(res.data || []);
  };

  const loadTeacherMeetings = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/notify/api/getStudentMeetings`
    );
    setMeetings(res.data || []);
  };

  /* ---------------- USERS ---------------- */
  useEffect(() => {
    if (form.sendTo === "STUDENT_ID") fetchStudents();
    else if (form.sendTo === "TEACHER_ID") fetchTeachers();
    else {
      setUserIds([]);
      setForm(p => ({ ...p, userId: "" }));
    }
  }, [form.sendTo]);

  const fetchStudents = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/students`
    );
    setUserIds(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/teachers`
    );
    setUserIds(res.data);
  };

  /* ---------------- POPUP ---------------- */
  const openAddPopup = () => {
    setForm({ id: null, title: "", message: "", sendTo: "ALL", userId: "" });
    setIsEditing(false);
    setShowPopup(true);
  };

  const openEditPopup = (item) => {
    setForm(item);
    setIsEditing(true);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const saveNotification = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      showError("Title & Message required");
      return;
    }

    if (isEditing) {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/${form.id}`,
        form
      );
      setItems(p => p.map(n => n.id === form.id ? res.data : n));
    } else {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications`,
        form
      );
      setItems(p => [...p, res.data]);
    }

    closePopup();
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete Notification?")) return;
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/${id}`
    );
    setItems(p => p.filter(n => n.id !== id));
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
          {/* ================= NOTIFICATIONS ================= */}
          <h2 className="admin-page-title">Admin Notifications</h2>

          <div className="admin-box">
            <div className="admin-top-row">
              <button className="admin-btn-primary" onClick={openAddPopup}>
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
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map(n => (
                  <tr key={n.id}>
                    <td>{n.title}</td>
                    <td>{n.message}</td>
                    <td>{n.sendTo}</td>
                    <td>{n.userId || "-"}</td>
                    <td>
                      <button onClick={() => openEditPopup(n)}>Edit</button>
                      <button onClick={() => deleteNotification(n.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= TEACHER SCHEDULED MEETINGS ================= */}
          <h2 className="admin-page-title" style={{ marginTop: "40px" }}>
            Teacher Scheduled Meetings
          </h2>

          <div className="admin-box">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Teacher Name</th>
                  <th>Department</th>
                  <th>Subjects</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Description</th>
                  <th>Remind</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(m => (
                  <tr key={m.id}>
                    <td>{m.teacherId}</td>
                    <td>{m.teacherName || "-"}</td>
                    <td>{m.department || "-"}</td>
                    <td>{m.subjects || "-"}</td>
                    <td>{m.className || "-"}</td>
                    <td>{m.date}</td>
                    <td>{m.startTime}</td>
                    <td>{m.endTime}</td>
                    <td>{m.description}</td>
                    <td>{m.remind ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? "Edit" : "Create"} Notification</h3>

            <form onSubmit={saveNotification}>
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />

              <label>Message *</label>
              <textarea
                className="textArea"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
              />

              <label>Send To</label>
              <select
                value={form.sendTo}
                onChange={(e) => handleChange("sendTo", e.target.value)}
              >
                <option value="ALL">ALL</option>
                <option value="STUDENT">ALL STUDENTS</option>
                <option value="TEACHER">ALL TEACHERS</option>
                <option value="STUDENT_ID">STUDENT ID</option>
                <option value="TEACHER_ID">TEACHER ID</option>
              </select>

              {(form.sendTo === "STUDENT_ID" || form.sendTo === "TEACHER_ID") && (
                <select
                  value={form.userId}
                  onChange={(e) => handleChange("userId", e.target.value)}
                >
                  <option value="">Select User</option>
                  {userIds.map(u => (
                    <option key={u.loginid} value={u.loginid}>
                      {u.loginid} - {u.fullName}
                    </option>
                  ))}
                </select>
              )}

              <button className="button" type="submit">
                {isEditing ? "Update" : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
