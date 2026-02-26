// src/pages/StudentProfile.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";

export default function StudentProfile() {

  const login = useSelector((state)=>state.auth.user);
  const studentId = login?.userDetails?.loginid;

  const [attendanceData,setAttendanceData] = useState([]);
  const [gradeData,setGradeData] = useState([]);
  const [profileImage,setProfileImage] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [loading,setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(()=>{
    if(studentId){
      loadData();
      loadProfileImage();
    }
  },[studentId]);

  const loadData = async ()=>{
    try{
      const attendanceRes = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/analytics/api/grades/getAtendanceDetails",
        { params:{ studentId } }
      );

      const gradeRes = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/analytics/api/grades/getScoreDetails",
        { params:{ studentId } }
      );

      setAttendanceData(attendanceRes.data || []);
      setGradeData(gradeRes.data || []);
    }catch{
      setAttendanceData([]);
      setGradeData([]);
    }finally{
      setLoading(false);
    }
  };

  /* ================= PROFILE IMAGE ================= */

  const loadProfileImage = async ()=>{
    try{
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
        "/login/getProfileImage",
        { params:{ studentId } }
      );

      if(res.data){
        setProfileImage("data:image/jpeg;base64,"+res.data);
      }
    }catch{
      setProfileImage(null);
    }
  };

  const handleUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("studentId",studentId);
    formData.append("file",file);

    await axios.post(
      import.meta.env.VITE_API_BASE_URL +
      "/login/uploadProfileImage",
      formData
    );

    loadProfileImage();
    setShowModal(false);
  };

  const handleRemove = async()=>{
    await axios.delete(
      import.meta.env.VITE_API_BASE_URL +
      "/login/removeProfileImage",
      { params:{ studentId } }
    );
    setProfileImage(null);
    setShowModal(false);
  };

  /* ================= CALCULATIONS ================= */

  const presentCount = attendanceData.filter(
    (a)=>a.attendance === "Active"
  ).length;

  const attendancePercent =
    attendanceData.length > 0
      ? Math.round((presentCount/attendanceData.length)*100)
      : 0;

  const overallPerformance =
    gradeData.length > 0
      ? Math.round(
          gradeData.reduce((acc,g)=>acc+g.percentage,0) /
          gradeData.length
        )
      : 0;

  const performanceStatus =
    overallPerformance >= 75
      ? "Excellent"
      : overallPerformance >= 50
      ? "Good"
      : "Needs Improvement";

  return (
    <div>
      <Navbar/>

      <div className="profile-layout">
        <Sidebar/>

        <div className="profile-main">

          {/* PROFILE CARD */}
          <div className="profile-card profile-top">

            <div className="profile-left">
              <div
                className="profile-avatar"
                onClick={()=>setShowModal(true)}
              >
                {profileImage ? (
                  <img src={profileImage} alt="profile"/>
                ) : (
                  login?.userDetails?.fullName?.charAt(0)
                )}
              </div>

              <div>
                <h2>{login?.userDetails?.fullName}</h2>
                <p><b>Student ID:</b> {studentId}</p>
                <p><b>Email:</b> {login?.userDetails?.email}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-box">
                <h4>Attendance</h4>
                <h2>{attendancePercent}%</h2>
              </div>

              <div className="stat-box">
                <h4>Performance</h4>
                <h2>{overallPerformance}%</h2>
                <span>{performanceStatus}</span>
              </div>
            </div>

          </div>

          {/* GRADE DETAILS */}
          <div className="profile-card">
            <h3>Grade Details</h3>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {gradeData.length === 0 ? (
                    <tr>
                      <td colSpan="4" align="center">
                        No Grade Records
                      </td>
                    </tr>
                  ) : (
                    gradeData.map((g,index)=>(
                      <tr key={index}>
                        <td>{g.assessmentName}</td>
                        <td>{g.score}</td>
                        <td>{g.total}</td>
                        <td>{g.percentage}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* ATTENDANCE */}
          <div className="profile-card">
            <h3>Attendance Report</h3>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Subject</th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceData.length === 0 ? (
                    <tr>
                      <td colSpan="3" align="center">
                        No Attendance Records
                      </td>
                    </tr>
                  ) : (
                    attendanceData.map((a,index)=>(
                      <tr key={index}>
                        <td>{a.date || "-"}</td>
                        <td className={
                          a.attendance === "Active"
                            ? "green"
                            : "red"
                        }>
                          {a.attendance}
                        </td>
                        <td>{a.subjectName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>

      <Footer/>

      {/* IMAGE MODAL */}
      {showModal && (
        <div className="image-modal">
          <div className="image-modal-content">
            <h3>Change Profile Picture</h3>

            <div className="modal-avatar">
              {profileImage ? (
                <img src={profileImage}/>
              ) : (
                login?.userDetails?.fullName?.charAt(0)
              )}
            </div>

            <div className="modal-buttons">

              <label className="btn primary">
                Upload
                <input
                  type="file"
                  hidden
                  onChange={handleUpload}
                />
              </label>

              {profileImage && (
                <button
                  className="btn danger"
                  onClick={handleRemove}
                >
                  Remove
                </button>
              )}

              <button
                className="btn light"
                onClick={()=>setShowModal(false)}
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
