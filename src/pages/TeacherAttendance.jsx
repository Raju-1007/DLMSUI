import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";


export default function TeacherAttendance() {

  const { showError } = useMessage();
  const login = useSelector((state) => state.auth.user);

  const [teacherProfile, setTeacherProfile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const[StudentClassDetails,setStudentClassDetails]=useState("");

  /* ================= LOAD PROFILE FIRST ================= */

  useEffect(() => {
    if (login?.userDetails?.loginid) {
      loadProfile();
    }
  }, [login]);

  /* ================= LOAD ATTENDANCE AFTER PROFILE ================= */

  useEffect(() => {
    if (teacherProfile?.subjectName) {
      loadAttendanceBySubject();
    }
  }, [teacherProfile]);


  useEffect(() => {
    if (rows) {
      getStudentClassDetails();
    }
  }, [rows]);


  /* ================= API CALLS ================= */

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${login.userDetails.loginid}`
      );

      setTeacherProfile(res.data);
    } catch {
      showError("Failed to load teacher profile");
    }
  };

  const loadAttendanceBySubject = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getBySubjectAttendance`,
        {
          params: {
            subjectName: teacherProfile.subjectName,
          },
        }

      );

      setRows(res.data || []);
    } catch {
      showError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const getStudentClassDetails = async () => {
    try {

      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getStudentClassDetails`,
        {
          params: {
            loginId: rows[0].studentId,
          },
        }
      );
      setStudentClassDetails(res.data[0] || []);
    } catch {
      showError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
             <BackButton />
          <div className="ta-header">
            <h2>Attendance Tracker</h2>
            {teacherProfile && (
              <div>
                <strong>Subject:</strong> {teacherProfile.subjectName}
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "20px" }}>Loading attendance...</div>
          ) : (
            <table className="ta-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>className</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.length > 0 ? (
                  rows.map((s) => (
                    <tr key={s.id}>
                      <td>{s.studentId}</td>
                      <td>{s.studentName}</td>
                      <td>{s.subjectName}</td>
                      <td>{StudentClassDetails.class_name}</td>
                      <td>{s.date}</td>
                      <td>
                        <span
                          className={`ta-badge ${
                            s.attendance === "Active"
                              ? "ta-green"
                              : s.attendance === "Absent"
                              ? "ta-red"
                              : "ta-yellow"
                          }`}
                        >
                          {s.attendance}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
