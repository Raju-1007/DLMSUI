// src/pages/AdminStudents.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function AdminStudents() {
const { showSuccess, showError } = useMessage();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔥 One variable for both APIs
  const [data, setData] = useState({
    students: [],
    courses: []
  });

  // ================= HELPER: REMOVE DUPLICATES =================
  const uniqueValues = (arr) => [...new Set(arr)];

  // ================= LOAD BOTH APIs =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [studentRes, courseRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_BASE_URL+"/login/login/studentData"),
          axios.get(import.meta.env.VITE_API_BASE_URL+"/login/login/getStudentWithClassDetails")
        ]);

        setData({
          students: studentRes.data || [],
          courses: courseRes.data || []
        });

      } catch (error) {
        showError("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================= FRONTEND JOIN (studentId match) =================


  const combinedStudents = data.students.map((stu) => {
    const matchedCourses = data.courses.filter(
      (c) => String(c.studentid) === String(stu.loginid)
    );
    

    return {
      studentId: stu.loginid,
      name: stu.fullName,
      email: stu.email,
      status: stu.status,
      courses: matchedCourses
    };
  });

  // ================= SEARCH FILTER =================
  const filtered = combinedStudents.filter((s) => {
    if (!search) return true;
    const text = `${s.studentId} ${s.name}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">Manage Students</h2>

          <div className="admin-box">

            {/* TOP BAR */}
            <div className="admin-top-row">
              {/* <button className="admin-btn-primary">
                + Add Student
              </button> */}

              <input
                type="text"
                className="admin-search"
                placeholder="Search by ID / Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* TABLE */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    {/* <th>Section</th> */}
                    <th>Email</th>
                    <th>Enrolled Courses</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.studentId}>
                      <td>{s.studentId}</td>
                      <td>{s.name}</td>

                      {/* CLASS (DEDUPLICATED) */}
                      <td>
                        {uniqueValues(
                          s.courses.map((c) => c.class_name)
                        ).join(", ") || "-"}
                      </td>

                      {/* SECTION (DEDUPLICATED) */}
                      {/* <td>
                        {uniqueValues(
                          s.courses.map((c) => c.sectionName)
                        ).join(", ") || "-"}
                      </td> */}

                      <td>{s.email}</td>

                      {/* COURSES (DEDUPLICATED) */}
                      <td>
                        {uniqueValues(
                          s.courses.map((c) => c.title)
                        ).join(", ") || "Not Assigned"}
                      </td>

                      <td>
                        <span className="admin-badge badge-green">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
