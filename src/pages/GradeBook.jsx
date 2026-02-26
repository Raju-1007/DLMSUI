import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function GradeBook({ studentId }) {
  const { showSuccess, showError } = useMessage();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const login = useSelector((state) => state.auth.user);

  // Load grades when page mounts
  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getScoreDetails/${login?.userDetails?.loginid}`
    );

    setRows(res.data || []);
  } catch (error) {
    showError("Error fetching grades:", error);
  } finally {
    setLoading(false);
  }
};


  // Helper to color-code grades
  const getGradeColor = (grade) => {
    if (!grade) return "#6b7280"; // gray for N/A
    if (grade.startsWith("A")) return "#16a34a"; // green
    if (grade.startsWith("B")) return "#2563eb"; // blue
    return "#dc2626"; // red
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />
        <div style={{ padding: 24 }}>
          {/* Page Title */}
          <h2
            style={{
              marginBottom: 20,
              fontSize: 24,
              color: "#1e293b",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: 8,
              fontWeight: 700,
            }}
          >
            📘 My Grade
          </h2>

          {/* Card Container */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              padding: 16,
              minHeight: "60vh",
            }}
          >
            {/* Loading State */}
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                  color: "#475569",
                  fontSize: 18,
                }}
              >
                ⏳ Fetching grades...
              </div>
            ) : rows.length === 0 ? (
              // Empty State
              <div
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: 16,
                  marginTop: 40,
                }}
              >
                📭 No grades available yet.
              </div>
            ) : (
              // Grades Table
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 15,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                    <th style={thStyle}>Student ID</th>
                    <th style={thStyle}>Assignment</th>
                    <th style={thStyle}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((g, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#eef2ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          i % 2 === 0 ? "#ffffff" : "#f9fafb")
                      }
                    >
                      <td style={tdStyle}>{g.id}</td>
                      <td style={tdStyle}>{g.title || "Untitled"}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: 600,
                          color: getGradeColor(g.grade),
                        }}
                      >
                        {g.grade || "N/A"}
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

// Common styles
const thStyle = {
  padding: "12px 10px",
  fontWeight: 600,
  color: "#334155",
  borderBottom: "2px solid #e2e8f0",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  color: "#475569",
};
