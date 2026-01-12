// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import { http } from '../api/axios';

// // 🔹 Heatmap Card Component
// function HeatmapCard() {

//   const [grid, setGrid] = useState([...Array(7)].map(() => Array(24).fill(0)));
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   useEffect(() => {
//     http
//       .get('/analytics/engagement/heatmap?courseId=1')
//       .then((r) => setGrid(r.data?.grid || grid))
//       .catch((err) => console.error('Error loading heatmap:', err));
//   }, []);

//   return (
//     <div className="card" style={{ padding: 12 }}>
//       <h3 style={{ marginBottom: 8 }}>Engagement Heatmap</h3>
//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: '80px repeat(24, 1fr)',
//           gap: 4,
//           fontSize: 12,
//         }}
//       >
//         <div />
//         {Array.from({ length: 24 }).map((_, h) => (
//           <div key={h} style={{ textAlign: 'center' }}>
//             {h}
//           </div>
//         ))}
//         {grid.map((row, d) => (
//           <React.Fragment key={d}>
//             <div style={{ textAlign: 'right', paddingRight: 6 }}>{days[d]}</div>
//             {row.map((v, h) => {
//               const a = Math.min(1, v / 10);
//               const bg = `rgba(59,130,246,${0.1 + 0.6 * a})`;
//               return (
//                 <div
//                   key={h}
//                   title={`${v} events`}
//                   style={{
//                     height: 14,
//                     borderRadius: 6,
//                     background: bg,
//                     transition: 'background 0.3s',
//                   }}
//                 />
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }

// // 🔹 Assign Topic Card Component


// // 🔹 Main Teacher Dashboard
// export default function TeacherDashboard() {
//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
//         <Sidebar />
//         <div style={{ padding: 16 }}>
//           <h2>Teacher Dashboard</h2>

//           {/* Snapshot */}
//           <div className="card" style={{ marginBottom: 16 }}>
//             Class performance snapshot
//           </div>

//           {/* Engagement Heatmap */}
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: '1fr',
//               gap: 12,
//               marginTop: 12,
//             }}
//           >
//             <HeatmapCard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import { useNavigate } from "react-router-dom";

// export default function TeacherDashboard() {
//   const navigate=useNavigate();
//   return (
//     <div>
//       <Navbar />

//       <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
//         <Sidebar />

//         {/* RIGHT CONTENT AREA */}
//         <div className="td-wrapper">

//           {/* Title */}
//            <button
//               className="add-details-btn"
//               onClick={() => navigate("/instructor-details")}
//             >
//               ➕ Add Your Details
//             </button>
//           <h2 className="td-title">Teacher Dashboard</h2>


//           {/* TOP SIX CARDS */}
//           <div className="td-grid">

//             <div className="td-card">
//               <div className="td-icon blue">👤</div>
//               <p className="td-value">34527</p>
//               <p className="td-label">Total Students</p>
//               <p className="td-sub">70% Increase in 18 Days</p>
//             </div>

//             <div className="td-card">
//               <div className="td-icon blue">🧑‍🎓</div>
//               <p className="td-value">5675</p>
//               <p className="td-label">New Students</p>
//               <p className="td-sub">55% Increase in 17 Days</p>
//             </div>

//             <div className="td-card">
//               <div className="td-icon yellow">📘</div>
//               <p className="td-value">126</p>
//               <p className="td-label">Total Courses</p>
//               <p className="td-sub">66% Increase in 18 Days</p>
//             </div>

//             <div className="td-card">
//               <div className="td-icon purple">👨‍🏫</div>
//               <p className="td-value">638</p>
//               <p className="td-label">Total Instructors</p>
//               <p className="td-sub">7% Increase in 18 Days</p>
//             </div>

//             <div className="td-card">
//               <div className="td-icon blue">👨‍🎓</div>
//               <p className="td-value">27334</p>
//               <p className="td-label">Total Active Students</p>
//               <p className="td-sub">55% Increase in 17 Days</p>
//             </div>

//             <div className="td-card">
//               <div className="td-icon yellow">🎓</div>
//               <p className="td-value">7218</p>
//               <p className="td-label">Total Passed Out Students</p>
//               <p className="td-sub">55% Increase in 17 Days</p>
//             </div>

//           </div>

//           {/* SCHEDULES */}
//           <div className="td-box">
//             <h3>SCHEDULES</h3>

//             <p><b>Title:</b> New Course Launch (17/09/2024 · 9:30 AM)</p>
//             <p><b>Body:</b></p>
//             <p>
//               We are pleased to announce our new course “Introduction to Data Science”
//               starting today. This course is designed for both beginners and advanced learners.
//               Enroll now through your dashboard.
//             </p>
//           </div>

//           {/* STUDENT REVIEWS */}
//           <div className="td-box">
//             <h3>STUDENT REVIEWS</h3>

//             <p><b>Review 1</b></p>
//             <p>“The instructor is excellent!”</p>

//             <br />

//             <p><b>Review 2</b></p>
//             <p>“Very engaging and knowledgeable lecturer.”</p>

//             <br />

//             <p><b>Review 3</b></p>
//             <p>“Highly recommend — learned a lot.”</p>
//           </div>

//           {/* STUDENT PROFILES TABLE */}
//           <div className="td-box">
//             <h3>STUDENT PROFILES</h3>

//             <input
//               type="text"
//               placeholder="Search Student by Name or ID"
//               className="td-search"
//             />

//             <table className="td-table">
//               <thead>
//                 <tr>
//                   <th>STUDENT NAME</th>
//                   <th>STUDENT ID</th>
//                   <th>COURSE NAME</th>
//                   <th>COURSE COMPLETED (%)</th>
//                   <th>GRADE</th>
//                   <th>REPORTS</th>
//                   <th>STATUS</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 <tr>
//                   <td>Pankaj</td>
//                   <td>9867489</td>
//                   <td>Basic Computer Language</td>
//                   <td>85%</td>
//                   <td>B+</td>
//                   <td><span className="view">View Report</span></td>
//                   <td><span className="status green">Completed</span></td>
//                 </tr>

//                 <tr>
//                   <td>Dhawan</td>
//                   <td>5934670</td>
//                   <td>Data Entry</td>
//                   <td>35%</td>
//                   <td>C</td>
//                   <td><span className="view">View Report</span></td>
//                   <td><span className="status yellow">Upcoming</span></td>
//                 </tr>

//                 <tr>
//                   <td>Gambhir</td>
//                   <td>2384632</td>
//                   <td>DMI Tool</td>
//                   <td>90%</td>
//                   <td>A+</td>
//                   <td><span className="view">View Report</span></td>
//                   <td><span className="status green">Completed</span></td>
//                 </tr>

//                 <tr>
//                   <td>Ruturaj</td>
//                   <td>4287098</td>
//                   <td>Skill Development</td>
//                   <td>67%</td>
//                   <td>B+</td>
//                   <td><span className="view">View Report</span></td>
//                   <td><span className="status green">Completed</span></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>



//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext";
import LoginActivity from "../components/LoginActivity";
import axios from "axios";
import { useSelector } from "react-redux";


export default function TeacherDashboard() {
  const [studentsIds, setStudentsIds] = useState([]);
  const [Timetable, setTimetable] = useState([]);
  const [studentAssignmnets, setstudentAssignmnets] = useState("");
  const [rows, setRows] = useState("");
  const login = useSelector((state) => state.auth.user);


  useEffect(() => {
    teacherLoad();
    getStudentIds();
    getStudentAssignments();
    loadAssignments();
  }, []);

  const teacherLoad = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        `/api/admin/syllabus/timetable/${login.loginId}`
      );

      setTimetable(res.data || []);
    } catch (err) {
      showError("Error loading teacher data", err);
      setTimetable([]);
    } finally {

    }
  };

  const getStudentIds = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/api/roles/studentGetDataAttendance"
      );
      setStudentsIds(res.data || []);
    } catch (err) {
      showError(err);
      setStudentsIds([]);
    }
  };

  const getStudentAssignments = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/api/student/getAssignments"
      );
      setstudentAssignmnets(res.data || []);
    } catch (err) {
      showError(err);
      setstudentAssignmnets([]);
    }
  };

  const getTeacherTimeTable = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/api/student/getAssignments"
      );
      setstudentAssignmnets(res.data || []);
    } catch (err) {
      showError(err);
      setstudentAssignmnets([]);
    }
  };
  const loadAssignments = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/api/assessments/getassignmentAll"
      );

      setRows(res.data || []);

    } catch (err) {
      showError(err);
    }
  };
  const { showSuccess, showError } = useMessage();
  LoginActivity();
  return (
    <>
      <Navbar />

      <div className="td-layout">
        <Sidebar />

        <div className="td-wrapper">
          {/* HEADER */}
          <div className="td-header">
            <div>
              <h2>Dashboard</h2>
              <p className="td-subtitle">
                Good Morning, Ms. Priya. Here's an overview of your classes today.
              </p>
            </div>

            <div className="td-rating">
              <span>Avg Rating</span>
              <b>4.5 ⭐⭐⭐⭐☆</b>
            </div>
          </div>

          {/* TOP CARDS */}
          <div className="td-cards">
            <div className="td-card">
              <p>Total Students</p>
              <h3>{studentsIds.length}</h3>
            </div>

            <div className="td-card">
              <p>Total Classes</p>
              <h3>{Timetable.length}</h3>
            </div>

            <div className="td-card highlight">
              <p>Assignments Submitted Today</p>
              <h3>{studentAssignmnets.length}</h3>
            </div>
          </div>

          {/* SCHEDULE */}
          <div className="td-section">
            <div className="td-section-header">
              <h4>Today's Schedule</h4>
              <span>November 27, 2025</span>
            </div>

            <table className="td-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Class</th>
                  <th>Topic</th>
                  <th>Section</th>
                </tr>
              </thead>

              <tbody>
                {Timetable.length > 0 ? (
                  Timetable.map((item, index) => (
                    <tr key={index}>
                      <td>{item.startTime}</td>
                      <td>{item.endTime}</td>
                      <td>{item.className}</td>
                      <td>{item.syllabusTitle}</td>
                      <td>{item.section}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No Timetable Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

          {/* ASSIGNMENTS */}
          <div className="td-section">
            <h4>Assignments</h4>

            <table className="td-table">
              <thead>
                <tr>
                  <th>AssignmentTitle</th>
                  <th>Assignment</th>
                  <th>Class</th>
                  <th>Due Date</th>
                  <th>marks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((item, index) => (
                    <tr key={index}>

                      <td>{item.assignmentTitle}</td>
                      <td>{item.assignment}</td>
                      <td>{item.className}</td>
                       <td>{r.dueDate}</td>
                       <td>{r.maxMarks}</td>
                      <td><span className="badge yellow">Pending</span></td>
                    </tr>

                  ))
                )
                  : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No Timetable Data
                      </td>
                    </tr>


                  )};


              </tbody>
            </table>
          </div>

          {/* ATTENDANCE */}
          <div className="td-attendance">
            <div className="att-card">
              <p>Grade 6</p>
              <h3>92%</h3>
            </div>
            <div className="att-card">
              <p>Grade 7</p>
              <h3>89%</h3>
            </div>
            <div className="att-card">
              <p>Grade 8</p>
              <h3 className="orange">94%</h3>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
