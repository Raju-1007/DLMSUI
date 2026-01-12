import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherTimetable() {

  const { showSuccess, showError } = useMessage();

  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const login = JSON.parse(localStorage.getItem("loginDetails"));
  console.log(login)
  

    const load = async () => {
      try {

        const [ttRes, attRes] = await Promise.all([
          axios.get(
            import.meta.env.VITE_API_BASE_URL+`/api/admin/syllabus/timetable/${login.loginId}`
          ),
          axios.get(
            import.meta.env.VITE_API_BASE_URL+`/api/admin/teacherAttendance/attendance/${login.loginId}`
          )
        ]);

        setTimetable(ttRes.data || []);
        setAttendance(attRes.data || []);
      } catch(err) {
       showError("Error loading teacher data", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2 className="teacher-page-title">My Timetable & Attendance</h2>

          {/* ================= TIMETABLE ================= */}
          <div className="teacher-card">
            <h3 className="tt-sub-title">Weekly Class Schedule</h3>

            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>id</th>
                    
                    <th>tecaherName</th>
                    <th>startTime</th>
                    <th>endTime</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>syllabusTittle</th>
                    <th>section</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((t) => (
                    <tr key={t.id}>
                      <td>{t.teacherId}</td>
                       
                        <td>{t.teacherName}</td>
                         <td>{t.startTime}</td>
                          <td>{t.endTime}</td>
                      <td>{t.date}</td>
                      <td>{t.subject}</td>
                      <td>{t.className}</td>
                      <td>{t.syllabusTitle}</td>
                      <td>{t.section}</td>
                    </tr>
                  ))}

                  {timetable.length === 0 && (
                    <tr>
                      <td colSpan={4} align="center">
                        No timetable assigned
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* ================= ATTENDANCE ================= */}
          <div className="teacher-card mt-4">
            <h3 className="tt-sub-title">My Attendance</h3>

            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>teacherId</th>
                    <th>teacherName</th>
                    <th>subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                       <td>{a.teacherId}</td>
                      <td>{a.teacherName}</td>
                      <td>{a.subject}</td>
                      <td>{a.date}</td>

                      <td>
                        <span
                          className={`att-badge ${
                            a.status === "Present"
                              ? "green"
                              : a.status === "Absent"
                              ? "red"
                              : "yellow"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={2} align="center">
                        No attendance records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
