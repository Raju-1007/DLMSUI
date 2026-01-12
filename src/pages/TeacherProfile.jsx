// src/pages/TeacherProfile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

export default function TeacherProfile() {

  // MOCK DATA (later replace with API / localStorage)
const[teacherIds,setTeacherIds]=useState(null);
const login=useSelector((state)=>state.auth.user)

useEffect(() => {
  if (login?.loginId) {
    getInstructorDetails();
  }
}, [login?.loginId]);

  const getInstructorDetails = async () => {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL +
        "/api/instructor/getinstructorDetails"
    );
     let teacherFilterIds = res.data.filter((prev) => prev.loginId === login?.loginId) || [];
    setTeacherIds(teacherFilterIds  || []);
    console.log(teacherIds,"teacherIdsteacherIdsteacherIds");
  } catch (err) {
    showError(err?.message || "Failed to load instructor details");
    setTeacherIds([]);
  }
};



 const teacher = teacherIds? {
  name: teacherIds[0]?.name,
  teacherId: teacherIds[0]?.loginId,
  skills: teacherIds[0]?.skills,
  department: teacherIds[0]?.department,
  experience: teacherIds[0]?.experience || 0,
  email: teacherIds[0]?.email,
  phone: teacherIds[0]?.mobile,
  rating: 4.6,
} : null;

  return (
    <div>
      <Navbar />

      <div className="sp-layout">
        <Sidebar />

        <div className="sp-main">

          {/* ================= TEACHER PROFILE CARD ================= */}
          <div className="sp-card">
            <div className="sp-profile">
              <div>
                <h3>Teacher Profile Card</h3>
                <p><b>Name:</b> {teacher?.name}</p>
                <p><b>Teacher Id:</b> {teacher?.teacherId}</p>
                <p><b>Skills:</b> {teacher?.skills}</p>
                <p><b>Department:</b> {teacher?.department}</p>
                <p><b>Experience:</b> {teacher?.experience} Years</p>
                <p><b>Email:</b> {teacher?.email}</p>
                <p><b>Phone:</b> {teacher?.phone}</p>
              </div>

              <div className="sp-rating">
                <div className="sp-image">Image</div>
                <p>Avg Rating</p>
                <span>{teacher?.rating} ⭐</span>
              </div>
            </div>
          </div>

          {/* ================= TEACHING SUMMARY ================= */}
          <div className="sp-card">
            <h4>Teaching Summary</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Classes</th>
                  <th>Sections</th>
                  <th>Total Students</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mathematics</td>
                  <td>9th, 10th</td>
                  <td>A, B</td>
                  <td>120</td>
                </tr>
                <tr>
                  <td>Algebra</td>
                  <td>10th</td>
                  <td>A</td>
                  <td>60</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= TEACHER ATTENDANCE ================= */}
          <div className="sp-card">
            <h4>Teacher Attendance (Last 3 Months)</h4>

            <div className="att-layout">
              <div className="att-left">
                <div className="att-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      className="bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="progress"
                      strokeDasharray="94,100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.5">94%</text>
                  </svg>
                  <p>Attendance</p>
                </div>

                <div className="att-stats">
                  <p><span className="dot green"></span> Present</p>
                  <p><span className="dot red"></span> Absent</p>
                  <p><span className="dot yellow"></span> Leave</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= STUDENT PERFORMANCE IMPACT ================= */}
          <div className="sp-card">
            <h4>Student Performance Impact</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Avg Score</th>
                  <th>Pass %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mathematics</td>
                  <td>78%</td>
                  <td>92%</td>
                  <td className="green">Excellent</td>
                </tr>
                <tr>
                  <td>Algebra</td>
                  <td>72%</td>
                  <td>88%</td>
                  <td className="blue">Good</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= CONTENT ACTIVITY ================= */}
          <div className="sp-card">
            <h4>Content & Activity Summary</h4>

            <ul className="sp-list">
              <li>📹 Videos Uploaded: 45</li>
              <li>📄 PDFs Uploaded: 32</li>
              <li>📝 Assignments Created: 18</li>
              <li>💬 Doubts Resolved: 120+</li>
            </ul>
          </div>

          {/* ================= FEEDBACK ================= */}
          <div className="sp-card">
            <h4>Student Feedback</h4>
            <ul className="sp-list">
              <li>✔ Explains concepts clearly</li>
              <li>✔ Supportive and friendly</li>
              <li>⚠ Needs to improve time management</li>
            </ul>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
