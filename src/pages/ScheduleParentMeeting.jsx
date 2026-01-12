// src/pages/ScheduleParentMeeting.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext"; 


export default function ScheduleParentMeeting() {
  const { showSuccess, showError } = useMessage();
  return (
    <div>
      <Navbar />

      <div className="spm-layout">
        <Sidebar />

        <div className="spm-main">
          <h2 className="spm-title">Schedule Parent Meeting</h2>

          {/* ================= STUDENT INFO ================= */}
          <div className="spm-card">
            <h4 className="spm-section-title">Student Information</h4>

            <div className="spm-grid">
              <p><b>Student Name:</b> Rama Krishna Varma</p>
              <p><b>Roll Number:</b> 2934798</p>
              <p><b>Class:</b> Class 7</p>
              <p><b>Grade:</b> Grade B</p>
            </div>
          </div>

          {/* ================= PARENT DETAILS ================= */}
          <div className="spm-card">
            <h4 className="spm-section-title">Parent Details</h4>

            <div className="spm-grid">
              <p><b>Parent Name:</b> Srikanth Varma</p>
              <p><b>Parent Contact Number:</b> 0938382982</p>
              <p><b>Parent Email ID:</b> akhcaidh@mail.com</p>
            </div>
          </div>

          {/* ================= MEETING DETAILS ================= */}
          <div className="spm-card">
            <h4 className="spm-section-title">Meeting Details</h4>

            <div className="spm-form-grid">
              <div>
                <label>Select Date</label>
                <input type="date" />
              </div>

              <div>
                <label>Choose Time</label>
                <input type="time" />
              </div>

              <div>
                <label>Meeting Platform</label>
                <select>
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>Microsoft Teams</option>
                </select>
              </div>

              <div>
                <label>Enter Mail ID</label>
                <input type="email" placeholder="Enter Mail ID" />
              </div>

              <div>
                <label>Reason for Meeting</label>
                <select>
                  <option>Feedback on Assignments</option>
                  <option>Attendance Discussion</option>
                  <option>Performance Review</option>
                </select>
              </div>

              <div>
                <label>Reminder to Parent</label>
                <select>
                  <option>Send Mail</option>
                  <option>Send SMS</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="spm-actions">
            <button className="btn-cancel">Cancel</button>
            <button className="btn-submit">Schedule Meeting</button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
