import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext"; 

export default function MyGrades() {
  const { showSuccess, showError } = useMessage();
  const loginDetails = useSelector((state) => state.auth.user);

  const [grades, setGrades] = useState([]);   // ✅ ARRAY
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loginDetails?.loginId) {
      loadAssignments();
    }
  }, [loginDetails]);

  const loadAssignments = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/api/grades/getStudentGrades",
        {
          params: {
            studentId: loginDetails.loginId,
          },
        }
      );

      if (res.data && res.data.length > 0) {
        setGrades(res.data);   // ✅ ARRAY
      } else {
        setGrades([]);
      }
    } catch(err) {
       showError("API failed", err);
      setGrades([]);
    } finally {
      setLoading(false);      // ✅ IMPORTANT
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return "#6b7280";
    if (grade.startsWith("A")) return "#16a34a";
    if (grade.startsWith("B")) return "#2563eb";
    return "#dc2626";
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 20, fontSize: 24, fontWeight: 700 }}>
            📘 My Grades
          </h2>

          <div style={{ background: "#fff", padding: 16, minHeight: "60vh" }}>
            {loading ? (
              <div style={{ textAlign: "center", fontSize: 18 }}>
                ⏳ Fetching grades...
              </div>
            ) : grades.length === 0 ? (   // ✅ FIX
              <div style={{ textAlign: "center", marginTop: 40 }}>
                📭 No grades available yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Student ID</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Class</th>
                    <th style={thStyle}>Subject</th>
                    <th style={thStyle}>Assessment</th>
                    <th style={thStyle}>Marks</th>
                    <th style={thStyle}>Out Of</th>
                    <th style={thStyle}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{g.studentId}</td>
                      <td style={tdStyle}>{g.student}</td>
                      <td style={tdStyle}>{g.className}</td>
                      <td style={tdStyle}>{g.subject}</td>
                      <td style={tdStyle}>{g.assessment}</td>
                      <td style={tdStyle}>{g.marks}</td>
                      <td style={tdStyle}>{g.outOf}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: 600,
                          color: getGradeColor(g.grade),
                        }}
                      >
                        {g.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #e2e8f0",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
};
