

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext";

import axios from "axios";
import { useSelector } from "react-redux";



export default function TeacherDashboard() {
   
  const [studentsIds, setStudentsIds] = useState([]);
  const [Timetable, setTimetable] = useState([]);
  const [studentAssignmnets, setstudentAssignmnets] = useState("");
  const [rows, setRows] = useState("");
  const login = useSelector((state) => state.auth.user);


  useEffect(() => {
    // teacherLoad();
    // getStudentIds();
    // getStudentAssignments();
    // loadAssignments();
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
                {login.userDetails.fullName}. Here's an overview of your classes today.
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
                        No Assignments Data
                      </td>
                    </tr>
                  )}
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
