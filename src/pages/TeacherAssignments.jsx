import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext"; 
import { useSelector } from "react-redux";


export default function TeacherAssignments() {
  const { showSuccess, showError } = useMessage();
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [studentsIds, setStudentsIds] = useState([]);
  const login=useSelector((state)=>state.auth.user);

  const [assignmentForm, setAssignmentForm] = useState({
    studentId: "",
    studentName: "",
    className: "",
    assignmentTitle: "",
    assignment: "",
    dueDate: "",
    maxMarks: "",
  });

  /* ================= LOAD ASSIGNMENTS ================= */
  useEffect(() => {
     if (login?.Adhaar) {
    loadAssignments();
     }
  }, [login]);

  const loadAssignments = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          "/api/assessments/getassignmentAll"
      );

      setRows(res.data || []);
      setFilteredRows(res.data || []);
    } catch(err) {
       showError(err);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter((r) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );

    setFilteredRows(filtered);
  };

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setAssignmentForm({
      ...assignmentForm,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= LOAD STUDENTS ================= */
  const getStudentIds = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          "/api/roles/studentGetDataAttendance"
      );
      setStudentsIds(res.data || []);
    } catch(err) {
       showError(err);
      setStudentsIds([]);
    }
  };

  /* ================= STUDENT SELECT ================= */
  const handleStudentSelect = (studentId) => {
    const selectedStudent = studentsIds.find(
      (stu) => String(stu.loginid) === String(studentId)
    );
   

    setAssignmentForm({
      ...assignmentForm,
      studentId: studentId,
      studentName: selectedStudent ? selectedStudent.fullName : "",
      // className: selectedStudent ? selectedStudent.className || "" : "",
    });
  };
   console.log(assignmentForm,"setAssignmentFormsetAssignmentForm");

  /* ================= SAVE ASSIGNMENT ================= */
  const saveAssignment = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/assessments/addassignment",
        {
          ...assignmentForm,
          status: "ASSIGNED",
        }
      );

      showSuccess("Assignment added successfully");

      setShowPopup(false);
      loadAssignments();

      setAssignmentForm({
        studentId: "",
        studentName: "",
        className: "",
        assignmentTitle: "",
        assignment: "",
        dueDate: "",
        maxMarks: "",
      });
    } catch(err) {
       showError(err);
      showSuccess("Failed to add assignment");
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <Navbar />

      <div className="cls-layout">
        <Sidebar />

        <div className="cls-main">
          {/* HEADER */}
          <div className="cls-header">
            <h2>Assignments · Class 7 · Section B</h2>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* SEARCH */}
              <div className="search-box">
                <input
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <span
                  className="search-icon"
                  style={{ cursor: "pointer" }}
                  onClick={handleSearch}
                >
                  🔍
                </span>
              </div>

              <button
                className="cls-add-btn"
                onClick={() => {
                  setShowPopup(true);
                  getStudentIds();
                }}
              >
                + Add Assignments
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="cls-card">
            <table className="cls-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Title</th>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Marks</th>
                  <th>Prepare</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.studentId}</td>
                      <td>{r.studentName}</td>
                      <td>{r.className}</td>
                      <td>{r.assignmentTitle}</td>
                      <td>{r.assignment}</td>
                      <td>{r.dueDate}</td>
                      <td>{r.maxMarks}</td>

                      <td>
                        <button
                          className="prepare-btn"
                          onClick={() =>
                            navigate(
                              `/teacherQuestionBuilder/${r.studentId}`
                            )
                          }
                        >
                          Prepare Questions
                        </button>
                      </td>

                      <td>
                        <span className="cls-status assigned">
                          {r.status || "NOT ASSIGNED"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Add Assignment</h3>

            <label>
              Select Student Id <span className="req">*</span>
            </label>
            <select
              className="teacherGetAttendanceId"
              value={assignmentForm.studentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              <option value="">Select Student</option>
              {studentsIds.map((stu) => (
                <option key={stu.loginid} value={stu.loginid}>
                  {stu.loginid}
                </option>
              ))}
            </select>
            <label>name<span className="req">*</span></label>
            <input
              placeholder="Name"
              value={assignmentForm.studentName}
              readOnly
            />
           <label>Enter class Name<span className="req">*</span></label>
            <input
              name="className"
              placeholder="Class"
              value={assignmentForm.className}
              onChange={handleChange}
            />
            <label>Enter Assignment Title<span className="req">*</span></label>
            <input
              name="assignmentTitle"
              placeholder="Assignment Title"
              value={assignmentForm.assignmentTitle}
              onChange={handleChange}
            />
             <label>Enter Assignmnet<span className="req">*</span></label>
            <input
              name="assignment"
              placeholder="Assignment"
              value={assignmentForm.assignment}
              onChange={handleChange}
            />
             <label>Enter Due Date<span className="req">*</span></label>
            <input
              type="date"
              name="dueDate"
              value={assignmentForm.dueDate}
              onChange={handleChange}
            />
             <label>Marks<span className="req">*</span></label>
            <input
              name="maxMarks"
              placeholder="Max Marks"
              value={assignmentForm.maxMarks}
              onChange={handleChange}
            />

            <div className="popup-actions">
              <button className="btn-save" onClick={saveAssignment}>
                Save
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
