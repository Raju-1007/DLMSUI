import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 

const AssignGrade = () => {
  const { showSuccess, showError } = useMessage();

  const [grade, setGrade] = useState("");
  const [assignment, setAssignment] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleAddGrade = async () => {
    if (!studentId || !assignment || !grade) {
      showError("⚠️ Please fill all fields");
      return;
    }
    
    const data = {
      id: studentId,
      title: assignment,
      grade: grade,
    };

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/courses/addCourses", data);
      showSuccess("✅ Grade added successfully!");
      setGrade("");
      setAssignment("");
      setStudentId("");
    } catch (error) {
     showError("Error adding grade:", error);
      showSuccess("❌ Failed to add grade");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="assign-container">
          <h3 className="assign-title">Add Assignment Grade</h3>

          <div className="assign-card">
            <input
              className="assign-input"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <input
              className="assign-input"
              placeholder="Assignment Title"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
            />

            <input
              className="assign-input"
              placeholder="Grade"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />

            <button onClick={handleAddGrade} className="assign-btn">
              Add Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignGrade;
