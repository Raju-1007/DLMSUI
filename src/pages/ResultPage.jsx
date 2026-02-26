import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";


export default function ResultPage() {
  const { state } = useLocation();
  const login = useSelector((state) => state.auth.user);

  console.log(login, ":::::::::::::::::::::::::::::::::::");

  console.log(state, "::::::::::::::state:::::::::::::");
  const score = state?.score ?? 0;
  const total = state?.total ?? 10;
  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  const studentId = login?.userDetails?.loginid;
  const studentName = login?.userDetails?.fullName;
  const assessmentName = state?.state?.courseTitle;

  const payload = {
    score: score,
    total: total,
    percentage: percentage,
    studentId: studentId,
    studentName: studentName,
    assessmentName: assessmentName,
     date: moment().format("YYYY-MM-DD"),
  }
   useEffect(()=>{
          handilePercentage(); 
   });
  const handilePercentage = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/addScoreDetails`,
        payload
      );
    }
    catch (err) {
      showError("add percteange failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="result-layout">
        <Sidebar />

        <div className="result-content">
          <div className="result-card">

            <h2 className="result-title">
              📊 Assessment Result
            </h2>

            {/* Student Info */}
            <div className="result-info">
              <p><b>Student ID:</b> {studentId}</p>
              <p><b>Student Name:</b> {studentName}</p>
              <p><b>Assessment:</b> {assessmentName}</p>
            </div>

            {/* Score Section */}
            <div className="score-section">

              <div className="circle-wrapper">
                <div className="circle">
                  <span>{percentage}%</span>
                </div>
              </div>

              <div className="score-details">
                <h3>Score: {score} / {total}</h3>
                <p className={
                  percentage >= 40
                    ? "status-pass"
                    : "status-fail"
                }>
                  {percentage >= 40
                    ? "PASS ✅"
                    : "FAIL ❌"}
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
