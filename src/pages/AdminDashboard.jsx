import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import LoginActivity from "../components/LoginActivity";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AdminDashboard() {
  LoginActivity();

  const [TeacherData, setTeacherData] = useState([]);
  const [data, setData] = useState({ students: [], courses: [] });

  const pdfRef = useRef();
  const [pdfAction, setPdfAction] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadTeacherData();
    loadCounts();
  }, []);

  const loadCounts = async () => {
    const [students, courses] = await Promise.all([
      axios.get(import.meta.env.VITE_API_BASE_URL + "/api/roles/studentData"),
      axios.get(import.meta.env.VITE_API_BASE_URL + "/api/courses/getCourses"),
    ]);

    setData({
      students: students.data || [],
      courses: courses.data || [],
    });
  };

  const loadTeacherData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/api/roles/teacherData"
      );
      setTeacherData(res.data);
    } catch {
      setTeacherData([
        {
          name: "Ruturaj",
          studentId: "4287098",
          department: "Skill Development",
          progress: "67%",
          rating: "★★★★★",
          status: "Completed",
        },
      ]);
    }
  };

  const generatePDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdfAction === "view"
      ? window.open(pdf.output("bloburl"))
      : pdf.save("teacher-report.pdf");
  };

  return (
    <div className="page-layout">
      <Navbar />

      <div className="content-layout">
        <Sidebar />

        <div className="td-wrapper">
          <h2 className="td-title">Admin Dashboard</h2>

          {/* CARDS */}
          <div className="td-grid">
            <div className="td-card">
              <div className="td-icon purple">👤</div>
              <p className="td-value">{data.students.length}</p>
              <p className="td-label">Total Students</p>
            </div>

            <div className="td-card">
              <div className="td-icon yellow">📘</div>
              <p className="td-value">{data.courses.length}</p>
              <p className="td-label">Total Courses</p>
            </div>

            <div className="td-card">
              <div className="td-icon blue">👨‍🏫</div>
              <p className="td-value">{TeacherData.length}</p>
              <p className="td-label">Total Instructors</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="td-table-box">
            <h3>TEACHER PROFILES</h3>

            <table className="td-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>DEPARTMENT</th>
                  <th>PROGRESS</th>
                  <th>RATING</th>
                  <th>REPORT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {TeacherData.map((t, i) => (
                  <tr key={i}>
                    <td>{t.name}</td>
                    <td>{t.studentId}</td>
                    <td>{t.department}</td>
                    <td>{t.progress}</td>
                    <td>{t.rating}</td>
                    <td>
                      <span
                        className="view"
                        onClick={() => {
                          setPdfAction("view");
                          setSelectedItem(t);
                          setTimeout(generatePDF, 200);
                        }}
                      >
                        View
                      </span>
                      <br />
                      <span
                        className="view download"
                        onClick={() => {
                          setPdfAction("download");
                          setSelectedItem(t);
                          setTimeout(generatePDF, 200);
                        }}
                      >
                        Download
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          t.status === "Completed" ? "green" : "yellow"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      

      {/* PDF TEMPLATE */}
      {selectedItem && (
        <div ref={pdfRef} className="pdf-hidden">
          <h1>Teacher Completion Report</h1>
          <p>Name: {selectedItem.name}</p>
          <p>ID: {selectedItem.studentId}</p>
          <p>Department: {selectedItem.department}</p>
          <p>Status: {selectedItem.status}</p>
        </div>
      )}
    <Footer /> 
    </div>
  );
}
