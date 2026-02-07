import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";

export default function ReceiveNotifications() {

  const { showError } = useMessage();
  const login = useSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState([]);
  const [teacherTimeTable, setTeacherTimeTable] = useState([]);
  const [teacherMeta, setTeacherMeta] = useState({
    className: "",
    subjectName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchTeacherTimeTable();
  }, []);

  /* ------------------ FETCH TEACHER TIMETABLE ------------------ */
  const fetchTeacherTimeTable = async () => {
    try {
      // 1️⃣ Teacher profile
      const teacherRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${login?.userDetails?.loginid}`
      );

      const profile = teacherRes.data?.[0]; 
      // ["Class 2",2,"EVS",4]

      if (!profile) {
        showError("Teacher profile not found");
        return;
      }

      const className = profile[0];
      const classId = profile[1];
      const subjectName = profile[2];
      const subjectId = profile[3];

      // store names for UI
      setTeacherMeta({
        className,
        subjectName
      });

      // 2️⃣ Full timetable
      const timetableRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/teachertimeTableDetails`
      );

      // 3️⃣ Filter by classId + subjectId
      const filtered = timetableRes.data.filter(
        (t) => t.classId === classId && t.subjectId === subjectId
      );

      setTeacherTimeTable(filtered);

    } catch (error) {
      showError("Error loading timetable");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ FETCH NOTIFICATIONS ------------------ */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications`
      );
      setNotifications(res.data || []);
    } catch (error) {
      showError("Error loading notifications");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="rn-page">
      <Navbar />

      <div className="rn-layout">
        <Sidebar />

        <div className="rn-content">

          <h2 className="rn-title">📅 My Timetable</h2>

          {loading ? (
            <p>Loading timetable...</p>
          ) : teacherTimeTable.length === 0 ? (
            <p>No timetable available</p>
          ) : (
            <>
              {/* Teacher Meta Info */}
              <div className="rn-meta-card">
                <strong>Class:</strong> {teacherMeta.className} &nbsp; | &nbsp;
                <strong>Subject:</strong> {teacherMeta.subjectName}
              </div>

              <table className="rn-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherTimeTable.map((t) => (
                    <tr key={t.timingId}>
                      <td>{t.dayOfWeek}</td>
                      <td>{t.startTime}</td>
                      <td>{t.endTime}</td>
                      <td>{t.durationMinutes} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <hr />

          <h2 className="rn-title">📩 Notifications</h2>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <div className="rn-list">
              {notifications.map((n) => (
                <div key={n.id} className="rn-card">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="rn-badge">{n.sendTo}</span>
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
