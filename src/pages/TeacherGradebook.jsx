// src/pages/TeacherGradebook.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherGradebook() {
  const { showSuccess, showError } = useMessage();
  const [rows, setRows] = useState([]);

  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [studentsIds, setStudentsIds] = useState([]);

  // Assign form
  const [form, setForm] = useState({
    studentId: "",
    student: "",
    className: "",
    subject: "",
    assessment: "",
    marks: "",
    outOf: "",
    grade: "",
  });

  // Add form
  const [newForm, setNewForm] = useState({
    studentId: "",
    student: "",
    className: "",
    subject: "",
    assessment: "",
    marks: "",
    outOf: "",
    grade: "",
  });

  useEffect(() => {
    loadGrades();
    getStudentIds();
  }, []);

  // LOAD GRADES
  const loadGrades = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/grades/getGrades");
      setRows(res.data || []);
    } catch {
      setRows([
        {
          id: 1,
          studentId: "092820",
          student: "Pankaj",
          className: "8A",
          subject: "Maths",
          assessment: "Unit Test 1",
          marks: 18,
          outOf: 20,
          grade: "A",
        },
      ]);
    }
  };

  // LOAD STUDENT IDS
  const getStudentIds = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/api/roles/studentGetDataAttendance"
      );
      setStudentsIds(res.data || []);
    } catch {
      setStudentsIds([]);
    }
  };

  // OPEN ASSIGN
  const openAssign = (r) => {
    setForm(r);
    setShowAssignPopup(true);
  };

  
  const saveAssign = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_BASE_URL+"/api/grades/addGrade",
        form
      );
      showSuccess("Grade Assigned Successfully ✔");
    } catch {
      showError("API failed — Assigned locally");
    }
    setShowAssignPopup(false);
  };

  // OPEN ADD
  const openAddPopup = () => {
    setNewForm({ 
      studentId: "",
      student: "",
      className: "",
      subject: "",
      assessment: "",
      marks: "",
      outOf: "",
      grade: "",
    });
    setShowAddPopup(true);
  };

  const handleAddStudentChange = (e) => {
  const studentuid = e.target.value;

  const selectedStudent = studentsIds.find(
    (stu) => String(stu.loginid) === String(studentuid)
  );
 

  if (!selectedStudent) return;

  setNewForm({
    ...newForm,
    studentId: studentuid,
    student: selectedStudent.fullName || selectedStudent.loginid,
    className: "",
  });
};


  // SAVE NEW GRADE
  const saveNewGrade = async () => {
    const newItem = { id: Date.now(), ...newForm };
    console.log(newItem,"============================================");

    // try {
    //   await axios.post(
    //     import.meta.env.VITE_API_BASE_URL+"/api/teacher/grades/add",
    //     newItem
    //   );
    // } catch {}

    setRows((prev) => [...prev, newItem]);
    setShowAddPopup(false);
  };

  // STUDENT ID DROPDOWN (REUSABLE)
  const studentDropdown = (value, onChange) => (
    <select value={value} onChange={onChange}>
      <option value="">Select Student</option>
      {studentsIds.map((stu) => (
        <option key={stu.studentuid} value={stu.studentuid}>
          {stu.loginid}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2 className="teacher-page-title">Gradebook</h2>

          <div className="grade-add-btn-container">
            <button className="grade-add-btn" onClick={openAddPopup}>
              + Add Grade
            </button>
          </div>

          <div className="teacher-card">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Assessment</th>
                  <th>Marks</th>
                  <th>Out Of</th>
                  <th>Grade</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.studentId}</td>
                    <td>{r.student}</td>
                    <td>{r.className}</td>
                    <td>{r.subject}</td>
                    <td>{r.assessment}</td>
                    <td>{r.marks}</td>
                    <td>{r.outOf}</td>
                    <td>{r.grade}</td>
                    <td>
                      <button
                        className="assign-btn"
                        onClick={() => openAssign(r)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ASSIGN POPUP */}
          {showAssignPopup && (
            <div className="ts-overlay" onClick={() => setShowAssignPopup(false)}>
              <div className="ts-popup" onClick={(e) => e.stopPropagation()}>
                <h3 className="ts-popup-title">Assign Grade</h3>

                <label>STUDENT ID :</label>
                {studentDropdown(form.studentId, (e) =>
                  setForm({ ...form, studentId: e.target.value })
                )}
                {Object.keys(form)
                  .filter((k) => k !== "studentId")
                  .map((key) => {
                    if(key!='id'){
                    return <>
                    <div >
                      <label>{key.toUpperCase()}</label>
                      <input
                        key={key}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                    </div>
                    </>
}})}

                <div className="ts-popup-actions">
                  <button
                    className="ts-btn ts-cancel"
                    onClick={() => setShowAssignPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="ts-btn ts-submit"
                    onClick={saveAssign}
                  >
                    Assign Grade
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADD POPUP */}
          {showAddPopup && (
  <div className="ts-overlay" onClick={() => setShowAddPopup(false)}>
    <div className="ts-popup" onClick={(e) => e.stopPropagation()}>
      <h3 className="ts-popup-title">Add New Grade</h3>

      {/* STUDENT ID */}
      <label>STUDENT ID</label>
      {studentDropdown(newForm.studentId, handleAddStudentChange)}

      {/* FORM FIELDS */}
      {Object.keys(newForm)
        .filter((k) => k !== "studentId")
        .map((key) => (
          <div key={key}>
            <label>{key.toUpperCase()}</label>
            <input
              value={newForm[key]}
              readOnly={key === "student"}   // ✅ ONLY NAME READONLY
              onChange={(e) =>
                setNewForm({ ...newForm, [key]: e.target.value })
              }
            />
          </div>
        ))}

      <div className="ts-popup-actions">
        <button
          className="ts-btn ts-cancel"
          onClick={() => setShowAddPopup(false)}
        >
          Cancel
        </button>
        <button
          className="ts-btn ts-submit"
          onClick={saveNewGrade}
        >
          Add Grade
        </button>
      </div>
    </div>
  </div>
)}


        </div>
      </div>

      <Footer />
    </div>
  );
}
