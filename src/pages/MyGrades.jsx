import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext";


export default function MyGrades() {
  const { showError } = useMessage();
  const loginDetails = useSelector((state) => state.auth.user);

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loginDetails?.userDetails?.loginid) {
      fetchGrades();
    }
  }, [loginDetails]);

  const fetchGrades = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getScoreDetails`,
        {
          params: {
            studentId: loginDetails?.userDetails?.loginid,
          },
        }
      );

      setGrades(res.data || []);
    } catch (error) {
      showError("Error fetching grades");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Status Logic
  const getStatus = (percentage) => {
    if (percentage < 35)
      return { text: "Low Performance", color: "#dc2626" };
    if (percentage >= 80)
      return { text: "Very Good", color: "#16a34a" };
    if (percentage >= 60)
      return { text: "Good", color: "#2563eb" };
    return { text: "Average", color: "#f59e0b" };
  };

  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <div className="content">
          <h2 className="page-title">📘 My Grades</h2>

          <div className="grade-container">
            {loading ? (
              <div className="loading">⏳ Fetching grades...</div>
            ) : grades.length === 0 ? (
              <div className="no-data">📭 No grades available yet.</div>
            ) : (
              <table className="grade-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Out Of</th>
                    <th>Percentage</th>
                    <th>date</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>

                <tbody>
                  {grades.map((g, i) => {
                    const percentage = Math.round(
                      (g.score / g.total) * 100
                    );
                    const status = getStatus(percentage);

                    return (
                      <tr key={i}>
                        <td>{g.assessmentName}</td>
                        <td>{g.score}</td>
                        <td>{g.total}</td>
                        <td>{percentage}%</td>
                        <td>{g.date}</td>

                        <td
                          style={{
                            color: status.color,
                            fontWeight: 600,
                          }}
                        >
                          {status.text}
                        </td>

                        <td>
                          <div className="progress-wrapper">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${percentage}%`,
                                background: status.color,
                              }}
                            ></div>

                            {/* Tooltip */}
                            <span className="tooltip">
                              {status.text}
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
    </div>
  );
}
