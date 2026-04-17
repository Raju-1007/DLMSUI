import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ReceiveNotifications() {

  const { showError } = useMessage();
  const login = useSelector((state) => state.auth.user);
  const navigator = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [teacherSpecific, setTeacherSpecific] = useState([]);
  const [teacherTimeTable, setTeacherTimeTable] = useState([]);
  const[studentNotificationTimeTable,setStudentNotificationTimeTable]=useState([])
  const[data,setData]=useState("");
  const [teacherMeta, setTeacherMeta] = useState({
    className: "",
    subjectName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications();
    fetchTeacherTimeTable();
  }, []);

  /* ------------------ TIMETABLE ------------------ */
  const fetchTeacherTimeTable = async () => {
    try {
      const teacherRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${login?.userDetails?.loginid}`
      );
    

      const profile = teacherRes.data;
      setData(profile);
      if (!profile) return;

      setTeacherMeta({
        className: profile.className,
        subjectName: profile.subjectName
      });
   
      const timetableRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/teachertimeTableDetails`
      );
      
      const filtered = timetableRes.data.content.filter(
        (t) =>
          t.classId === profile.classId &&
          t.subjectId === profile.subjectId
      );
      setTeacherTimeTable(filtered);

    } catch {
      showError("Error loading timetable");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ NOTIFICATIONS ------------------ */
  const getNotifications = async () => {
    try {
      const general = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/getALLNotifications`,
        { params: { sendTo: "TEACHER" } }
      );

      const specific = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/notifications/getALLNotifications`,
        {
          params: {
            sendTo: "TEACHERID",
            teacherId: login?.userDetails?.loginid
          }
        }
        
      );

      const studentNotiFications= await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notify/api/studentNotificationsDetails`,{
          params:{
            teacherId:login?.userDetails?.loginid
             
          }
      })
     setStudentNotificationTimeTable(studentNotiFications.data);
      setNotifications(general.data.content || []);
      setTeacherSpecific(specific.data.content|| []);

    } catch (err) {
      console.error(err);
    }
  };

  /* Merge Both */
  const mergedNotifications = [...notifications, ...teacherSpecific];

  /* ------------------ UI ------------------ */
  return (
    <div className="rn-page">
      <Navbar />

      <div className="rn-layout">
        <Sidebar />

        <div className="rn-content">

          {/* Timetable Section */}
          <h2 className="rn-title">📅 My Timetable</h2>

          {loading ? (
            <p>Loading timetable...</p>
          ) : (
            <>
              <div className="rn-meta-card">
                <strong>Class:</strong> {teacherMeta.className} &nbsp; | &nbsp;
                <strong>Subject:</strong> {teacherMeta.subjectName}
              </div>

              <table className="rn-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th>Schedule Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherTimeTable.map((t) => (
                    <tr key={t.timingId}>
                      <td>{t.dayOfWeek}</td>
                      <td>{t.startTime}</td>
                      <td>{t.endTime}</td>
                      <td>{t.durationMinutes} mins</td>
                      <td>
                       <button onClick={() => navigator("/teacher/timetable", { state: { timetable: t, teacherMeta: JSON.parse(JSON.stringify(data)) } })}> Go to Timetable </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <hr />

          {/* Notifications Section */}
          <h2 className="rn-title">📩 Notifications</h2>

          {mergedNotifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <div className="rn-list">
              {mergedNotifications.map((n, index) => (
                <div key={index} className="rn-card">
                  <div className="rn-card-header">
                    <span className="rn-role">{n.role || "ADMIN"}</span>
                    <span className="rn-date">{n.date}</span>
                  </div>

                  <h4 className="rn-title-text">{n.title}</h4>
                  <p className="rn-message">{n.message}</p>

                  <span className="rn-badge">{n.sendTo}</span>
                </div>
              ))}
            </div>
          )}

         <h2 className="rn-title">Student  Notifications</h2>
          {studentNotificationTimeTable.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <div className="rn-list">
              {studentNotificationTimeTable.map((n, index) => (
                <div key={index} className="rn-card">
                  <div className="rn-card-header">
                    <span className="rn-role">{n.className || "ADMIN"}</span>
                    <span className="rn-date">{n.date}</span>
                  </div>

                  
                  <p className="rn-message">{n.startTime}</p>
                   <p className="rn-message">{n.endTime}</p>

                  <span className="rn-badge">{n.description}</span>
                    <span className="rn-badge">  <a href={n.meetingLink} target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a></span>
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