// src/pages/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext";
import axios from "axios";

export default function StudentProfile() {

  /* ===================== STATE ===================== */
  const [students, setStudents] = useState([]);
  const [month, setMonth] = useState("");

  const { showSuccess, showError } = useMessage();

  /* ===================== LOCAL STORAGE ===================== */
  const login = JSON.parse(localStorage.getItem("studentsInformation"));
  const courseDetails = JSON.parse(localStorage.getItem("CourseData")) || [];
  const progress = JSON.parse(localStorage.getItem("progress")) || 0;

  /* ===================== STATUS LOGIC ===================== */
  let status = "Need to do Improve";
  if (progress >= 50 && progress < 75) status = "Good";
  if (progress >= 75) status = "Very Good";

  /* ===================== FILTER COURSES ===================== */
  const filterCourseDetails = courseDetails.filter(
    (prev) => prev.studentId == login.loginid
  );

  /* ===================== API CALL ===================== */
  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/api/attendances/getattendance"
      );
      setStudents(res.data || []);
    } catch (error) {
      setStudents([]);
    }
  };

  /* ===================== FILTER STUDENT ATTENDANCE ===================== */
  const studentAttendance = students.filter(
    (a) => a.studentId == login.loginid
  );

  /* ===================== ATTENDANCE CALCULATION ===================== */
  const getMonthName = (date) =>
    new Date(date).toLocaleString("default", { month: "long" });

  const calculateAttendanceByMonth = (data) => {
    const monthMap = {};

    data.forEach((item) => {
      const month = getMonthName(item.date);

      if (!monthMap[month]) {
        monthMap[month] = {
          present: 0,
          absent: 0,
          late: 0,
          total: 0,
        };
      }

      monthMap[month].total += 1;

      if (item.status === "PRESENT") monthMap[month].present += 1;
      if (item.status === "ABSENT") monthMap[month].absent += 1;
      if (item.status === "LATE") monthMap[month].late += 1;
    });

    const percentageData = {};
    Object.keys(monthMap).forEach((m) => {
      const { present, total } = monthMap[m];
      percentageData[m] =
        total > 0 ? Math.round((present / total) * 100) : 0;
    });

    return percentageData;
  };

  const attendance = calculateAttendanceByMonth(studentAttendance);

  /* Set default month once attendance loads */
  useEffect(() => {
    const months = Object.keys(attendance);
    if (months.length > 0) setMonth(months[0]);
  }, [students]);

  /* ===================== JSX ===================== */
  return (
    <div>
      <Navbar />

      <div className="sp-layout">
        <Sidebar />

        <div className="sp-main">

          {/* ================= STUDENT PROFILE ================= */}
          <div className="sp-card">
            <div className="sp-profile">
              <div>
                <h3>Student Profile Card</h3>
                <p><b>Name:</b> {login.fullName}</p>
                <p><b>Student Id:</b> {login.loginid}</p>
                <p><b>Class:</b> {courseDetails[0]?.className}</p>
                <p><b>Email:</b> {login.email}</p>
              </div>

              <div className="sp-rating">
                <div className="sp-image">Image</div>
                <p>Avg Rating</p>
                <span>4.5 ⭐</span>
              </div>
            </div>
          </div>

          {/* ================= ACADEMIC PERFORMANCE ================= */}
          <div className="sp-card">
            <h4>Academic Performance – Test Scores (3-Month Trend)</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Average</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterCourseDetails.length > 0 ? (
                  filterCourseDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{progress}%</td>
                      <td className="blue">{status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No Subjects Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= ATTENDANCE SUMMARY ================= */}
          <div className="sp-card">
            <h4>Attendance Summary (Past 3 Months)</h4>

            <div className="att-layout">

              {/* LEFT BIG CIRCLE */}
              <div className="att-left">
                <div className="att-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      className="bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="progress"
                      strokeDasharray={`${attendance[month] || 0},100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.5">
                      {attendance[month] || 0}%
                    </text>
                  </svg>
                  <p>Attendance</p>
                </div>

                <div className="att-stats">
                  <p><span className="dot green"></span> Present</p>
                  <p><span className="dot red"></span> Absent</p>
                  <p><span className="dot yellow"></span> Late</p>
                </div>
              </div>

              {/* RIGHT MONTHS */}
              <div className="att-months">
                {Object.keys(attendance).map((m) => (
                  <div
                    key={m}
                    className={`month-box ${month === m ? "active" : ""}`}
                    onClick={() => setMonth(m)}
                  >
                    <div className="mini-circle">
                      <svg viewBox="0 0 36 36">
                        <path
                          className="bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="progress"
                          strokeDasharray={`${attendance[m]},100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span>{attendance[m]}%</span>
                    </div>
                    <p>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= BACKLOGS ================= */}
          <div className="sp-card">
            <h4>Backlogs / Pending Work</h4>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Homework 2</td>
                  <td>Maths</td>
                  <td className="red">Pending</td>
                </tr>
                <tr>
                  <td>Lab Record</td>
                  <td>Science</td>
                  <td className="green">Submitted</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= BEHAVIOR ================= */}
          <div className="sp-card">
            <h4>Behavior / Class Participation</h4>
            <ul className="sp-list">
              <li>✔ Actively participates in discussions</li>
              <li>✔ Good teamwork skills</li>
              <li>⚠ Needs improvement in punctuality</li>
            </ul>
          </div>

          {/* ================= EXTRACURRICULAR ================= */}
          <div className="sp-card">
            <h4>Extracurricular & Activity Log</h4>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sports Meet</td>
                  <td>District</td>
                  <td>Participated</td>
                </tr>
                <tr>
                  <td>Science Fair</td>
                  <td>School</td>
                  <td>Winner</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= PARENT COMMUNICATION ================= */}
          <div className="sp-card">
            <h4>Parent Communication Section</h4>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12 Nov</td>
                  <td>Call</td>
                  <td>Discussed academic progress</td>
                </tr>
                <tr>
                  <td>18 Nov</td>
                  <td>Email</td>
                  <td>Attendance improvement plan</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
