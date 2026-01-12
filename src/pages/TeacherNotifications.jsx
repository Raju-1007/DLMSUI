// src/pages/TeacherNotifications.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { http } from "../api/axios";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherNotifications() {
  const [items, setItems] = useState([]);
  const [sendTo, setSendTo] = useState("ALL");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loginDetails, setLoginDetails] = useState({});
  const { showSuccess, showError } = useMessage();
  

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Load students

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));
    if (login) {
      setLoginDetails(login);
    }
    loadStudents();
  }, []);
  const loadStudents = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/studentData");
     
      setStudents(res.data || []);
    } catch (e) {
      setStudents([]);
    }
  };

  // useEffect(() => {
  //   const loadStudents = async () => {
  //     try {
  //       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/students");
  //       setStudents(res.data || []);
  //     } catch {
  //       setStudents([
  //         { id: "092820", name: "Pankaj", className: "8A", section: "A" },
  //         { id: "092654", name: "Manoj", className: "8A", section: "A" },
  //       ]);
  //     }
  //   };
  //   loadStudents();
  // }, []);

  // Load notifications
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/notify/teacher/1");
        setItems(res.data || []);
      } catch {
        setItems([
          {
            id: 1,
            title: "Holiday Announcement",
            body: "School will be closed on Friday due to festival.",
            from: "Admin",
          },
          {
            id: 2,
            title: "Exam Notice",
            body: "Maths exam scheduled for 05/12/2025.",
            from: "Admin",
          },
        ]);
      }
    };
    loadNotices();
  }, []);

  const sendNotification = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      showError("Please fill all fields");
      return;
    }

    const payload = {
      sendTo,
      studentId: sendTo === "SPECIFIC" ? selectedStudent : null,
      title,
      body,
      loginId:loginDetails.loginId
    };
    try {
       //const res = await http.post("/notify/send/notification", payload);
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/notifications/sendNotifications",payload)
     // const res = await http.post("/api/notifications/sendNotifications", payload);

      setItems((prev) => [...prev, res.data || payload]);
      showSuccess("Notification Sent!");
    } catch {
      const fake = { id: Date.now(), ...payload, from: "Teacher" };
      setItems((prev) => [...prev, fake]);
      showError("API Failed – Stored Locally");
    }

    setTitle("");
    setBody("");
  };

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main notify-wrapper">

          <h2 className="teacher-page-title">Notifications</h2>

          {/* SEND NEW NOTIFICATION */}
          <div className="teacher-card">

            <h3 className="teacher-card-title">Send New Notification</h3>

            <form className="notify-form" onSubmit={sendNotification}>
              
              {/* Send To */}
              <label className="notify-label">Send To</label>
              <select
                className="notify-select"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              >
                <option value="ALL">All Students</option>
                <option value="SPECIFIC">Specific Student</option>
              </select>

              {/* Select Student */}
              {sendTo === "SPECIFIC" && (
                <>
                  <label className="notify-label">Select Student</label>
                  <select
                    className="notify-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.loginid} value={s.loginid}>
                        {/* {s.name} — {s.className} / {s.section} */}
                        {s.loginid}-{s.fullName}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Title */}
              <label className="notify-label">Title</label>
              <input
                className="notify-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Message */}
              <label className="notify-label">Message</label>
              <textarea
                className="notify-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              <button className="notify-btn" type="submit">
                Send Notification
              </button>
            </form>
          </div>

          {/* RECENT NOTIFICATIONS */}
          <div className="teacher-card">
            <h3 className="notify-title">Recent Notifications</h3>

            <ul className="notify-list">
              {items.map((n) => (
                <li className="notify-item" key={n.id}>
                  <strong>{n.title}</strong>
                  <span>{n.body}</span>
                  <span className="notify-meta">From: {n.from || "Teacher"}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
