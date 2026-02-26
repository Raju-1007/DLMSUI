import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";

export default function TeacherNotifications() {

  const { showSuccess, showError } = useMessage();
  const loginDetails = useSelector((state) => state.auth.user);

  const [items, setItems] = useState([]);
  const [sendTo, setSendTo] = useState("ALL");
  const [studentsIds, setStudentsIds] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [teacherProfile, setTeacherProfile] = useState(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
   const [notificationDate, setNotificationDate] = useState("");

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (loginDetails?.userDetails?.loginid) {
      loadProfile();
    }
  }, [loginDetails]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${loginDetails?.userDetails?.loginid}`
      );

      setTeacherProfile(res.data || null);
    } catch {
      showError("Failed to load teacher profile");
    }
  };

  /* ================= LOAD STUDENTS BY LOCATION ================= */

  useEffect(() => {
    if (teacherProfile) {
      getClassLocationDetails();
    }
  }, [teacherProfile]);

  const getClassLocationDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/getStudentsByLocation`,
        {
          params: {
            districtId: teacherProfile.districtId,
            mandalId: teacherProfile.mandalId,
            villageId: teacherProfile.villageId,
            classId: teacherProfile.classId,
          },
        }
      );

      setStudentsIds([
        { studentid: "ALL", student_Name: "All Students" },
        ...(res.data?.students || []),   // ✅ FIXED HERE
      ]);

    } catch {
      setStudentsIds([]);
    }
  };

  /* ================= SEND NOTIFICATION ================= */

  const sendNotification = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      showError("Please fill all fields");
      return;
    }
    const selectedStudentObj = studentsIds.find(
      (s) => String(s.studentid) === String(selectedStudent)
    );

    const payload = {
      sendTo,
      studentId: sendTo === "SPECIFIC" ? selectedStudent : null,
      studentName: sendTo === "SPECIFIC" ? selectedStudentObj?.student_Name : null,
      title,
      body,
      date: notificationDate,   
      teacherLoginId: loginDetails?.userDetails?.loginid,
      teacherName: loginDetails?.userDetails?.fullName,
    };

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/notify/api/notifications/sendStudentNotifications",
        payload
      );

      setItems((prev) => [...prev, res.data || payload]);
      showSuccess("Notification Sent!");
    } catch {
      const fake = { id: Date.now(), ...payload, from: "Teacher" };
      setItems((prev) => [...prev, fake]);
      showError("API Failed – Stored Locally");
    }

    setTitle("");
    setBody("");
    setSelectedStudent("");
  };

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main notify-wrapper">

          <h2 className="teacher-page-title">Notifications</h2>

          <div className="teacher-card">
            <h3 className="teacher-card-title">Send New Notification</h3>

            <form className="notify-form" onSubmit={sendNotification}>

              <label className="notify-label">Send To</label>
              <select
                className="notify-select"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              >
                <option value="ALL">All Students</option>
                <option value="SPECIFIC">Specific Student</option>
              </select>

              {sendTo === "SPECIFIC" && (
                <>
                  <label className="notify-label">Select Student</label>
                  <select
                    className="notify-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Select Student</option>

                    {studentsIds.map((s) => (
                      <option key={s.studentid} value={s.studentid}>
                        {s.studentid} - {s.student_Name}  {/* ✅ FIXED */}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label className="notify-label">Select Date</label>
              <input
                type="date"
                className="notify-input"
                value={notificationDate}
                onChange={(e) => setNotificationDate(e.target.value)}
              />

              <label className="notify-label">Title</label>
              <input
                className="notify-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

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

          <div className="teacher-card">
            <h3 className="notify-title">Recent Notifications</h3>

            <ul className="notify-list">
              {items.map((n) => (
                <li className="notify-item" key={n.id || Math.random()}>
                  <strong>{n.title}</strong>
                  <span>{n.body}</span>
                  <span className="notify-meta">
                    From: {n.from || "Teacher"}
                  </span>
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
