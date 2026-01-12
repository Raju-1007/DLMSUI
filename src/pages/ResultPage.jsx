import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useMessage } from "../context/MessageContext"; 


export default function ResultPage() {
  const { showSuccess, showError } = useMessage();
  const { state } = useLocation();

  const score = state?.score ?? 0;
  const total = state?.total ?? 10; // optional
  const percentage = Math.round((score / total) * 100);

  // Normally from Redux / backend
  const studentId = "092820";
  const studentName = "Krishna Varma";
  const assessmentName = "Maths Unit Test 1";

  return (
    <>
      <Navbar />

      <div className="result-layout">
        <Sidebar />

        <div className="result-content">
          {/* HEADER */}
          <h2 className="result-title">📊 Assessment Result</h2>

          {/* STUDENT INFO */}
          <div className="result-info-card">
            <div><b>Student ID:</b> {studentId}</div>
            <div><b>Student Name:</b> {studentName}</div>
            <div><b>Assessment:</b> {assessmentName}</div>
          </div>

          {/* SCORE CARD */}
          <div className="score-card">
            <div className="score-circle">
              <span>{percentage}%</span>
            </div>

            <div className="score-details">
              <p><b>Score:</b> {score} / {total}</p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={
                    percentage >= 40 ? "status-pass" : "status-fail"
                  }
                >
                  {percentage >= 40 ? "PASS ✅" : "FAIL ❌"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
