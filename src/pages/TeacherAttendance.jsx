import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherAttendance() {
  const { showSuccess, showError } = useMessage();
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [students, setStudents] = useState([]);
  const [studentsIds, setStudentsIds] = useState([]);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    name: "",
    className: "",
    section: "",
    subject: "",
    status: "Present",
  });

  useEffect(() => {
    loadAttendance();
    getStudentIds();
  }, [date]);

  /* ================= API ================= */

  const getStudentIds = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          "/api/roles/studentGetDataAttendance"
      );
      console.log("STUDENT IDS 👉", res.data); // debug
      setStudentsIds(res.data || []);
    } catch {
      setStudentsIds([]);
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          `/api/attendances/attendance?date=${date}`
      );
      setStudents(res.data || []);
    } catch {
      setStudents([]);
    }
  };

  /* ================= SELECT STUDENT (WORKING) ================= */

  const handleStudentSelect = (loginid) => {
    const selected = studentsIds.find(
      (s) => String(s.loginid) === loginid
    );

    if (!selected) return;

    setNewStudent((prev) => ({
      ...prev,
      studentId: String(selected.loginid), // ✅ ID
      name: selected.fullName || "",        // ✅ ONLY NAME
    }));
  };

  /* ================= ADD ================= */

  const addNewStudent = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL +
          "/api/attendances/addattendance",
        {
          ...newStudent,
          studentId: Number(newStudent.studentId), // backend safe
          mark: newStudent.status,
          date,
        }
      );

      setStudents((prev) => [...prev, res.data]);
      setShowAddPopup(false);

      setNewStudent({
        studentId: "",
        name: "",
        className: "",
        section: "",
        subject: "",
        status: "Present",
      });
    } catch {
      showError("Add failed ❌");
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2>Attendance Tracker</h2>

          <button className="ta-add-btn" onClick={() => setShowAddPopup(true)}>
            + Add Attendance
          </button>

          <table className="ta-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.studentId}</td>
                  <td>{s.name}</td>
                  <td>{s.className}</td>
                  <td>{s.section}</td>
                  <td>{s.subject}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ADD POPUP ================= */}

      {showAddPopup && (
        <div className="ta-overlay">
          <div className="ta-popup">
            <h3>Add Attendance</h3>

            {/* STUDENT SELECT */}
            <label>Select Student Id<span className="req">*</span></label>
            <select className="teacherGetAttendanceId"
              value={newStudent.studentId}
              onChange={(e) =>
                handleStudentSelect(e.target.value)
              }
            >
              <option value="">Select Student</option>
              {studentsIds.map((stu) => (
                <option
                  key={stu.loginid}
                  value={String(stu.loginid)}
                >
                  {stu.loginid}
                </option>
              ))}
            </select>

            {/* NAME AUTO FILL */}
            <input
              placeholder="Name"
              value={newStudent.name}
              readOnly
            />
   
           <label>Enter Class Name<span className="req">*</span></label>
            <input
              placeholder="Class"
              value={newStudent.className}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  className: e.target.value,
                })
              }
            />
           <label>Enter Secation Name<span className="req">*</span></label>
            <input
              placeholder="Section"
              value={newStudent.section}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  section: e.target.value,
                })
              }
            />
           <label>Enter Subject Name<span className="req">*</span></label>
            <input
              placeholder="Subject"
              value={newStudent.subject}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  subject: e.target.value,
                })
              }
            />
            <label>Select Attendance<span className="req">*</span></label>
            <select className="selectAttendance"
              value={newStudent.status}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  status: e.target.value,
                })
              }
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
              <option>Excused</option>
            </select>

            <button onClick={addNewStudent}>Add</button>
            <button onClick={() => setShowAddPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
