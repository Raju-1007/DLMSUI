import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";


export default function TeacherGradebook() {
  const { showError } = useMessage();
  const login = useSelector((state) => state.auth.user);

  const [rows, setRows] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);
   const[StudentClassDetails,setStudentClassDetails]=useState("");

  // Load Teacher Profile
  useEffect(() => {
    if (login?.userDetails?.loginid) {
      loadProfile();
    }
  }, [login]);

  // Load Grades After Subject Available
  useEffect(() => {
    if (teacherProfile?.subjectName) {
      loadGradesBySubject();
    }
  }, [teacherProfile]);

   useEffect(() => {
      if (rows) {
        getStudentClassDetails();
      }
    }, [rows]);

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

  const loadGradesBySubject = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getBySubject`,
        {
          params: { assessmentName: teacherProfile.subjectName },
        }
      );

      setRows(res.data || []);
    } catch {
      showError("Failed to load grades");
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

  const getStatusColor = (percentage) => {
    if (percentage < 35) return "#dc2626";
    if (percentage >= 80) return "#16a34a";
    if (percentage >= 60) return "#2563eb";
    return "#f59e0b";
  };

  const getStatusText = (percentage) => {
    if (percentage < 35) return "Low Performance";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 60) return "Good";
    return "Average";
  };

  return (
    <div>
      <Navbar />

      <div className="tg-layout">
        <Sidebar />

        <div className="tg-main">
          <h2 className="tg-title">
            Students Gradebooks 
          </h2>

          <div className="tg-card">
            {loading ? (
              <div className="tg-loading">⏳ Loading grades...</div>
            ) : (
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>className</th>
                    <th>Assessment</th>
                    <th>Marks</th>
                    <th>Out Of</th>
                    <th>%</th>
                    <th>date</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const percentage = Math.round(
                      (r.score / r.total) * 100
                    );

                    return (
                      <tr key={r.id}>
                        <td>{r.studentName}</td>
                        <td>{StudentClassDetails.class_name}</td>
                        <td>{r.assessmentName}</td>
                        <td>{r.score}</td>
                        <td>{r.total}</td>
                        <td>{percentage}%</td>
                        <td>{r.date}</td>

                        <td
                          style={{
                            color: getStatusColor(percentage),
                            fontWeight: 600,
                          }}
                        >
                          {getStatusText(percentage)}
                        </td>

                        <td>
                          <div className="tg-progress-wrapper">
                            <div
                              className="tg-progress-fill"
                              style={{
                                width: `${percentage}%`,
                                background: getStatusColor(percentage),
                              }}
                            />
                            <span className="tg-tooltip">
                              {getStatusText(percentage)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
