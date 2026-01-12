import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { useMessage } from "../context/MessageContext"; 


export default function AssignTopic() {

  const { showSuccess, showError } = useMessage();
  const [topics, setTopics] = useState([]);
  const [student, setStudent] = useState("");
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");
  const [addtopicsValidation, setaddtopicsValidation] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/assessments/getassignment");
      console.log(res,"++++++++++++++++");
      setTopics(res.data);
    } catch(err) {
       showError("Error fetching topics:", err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!student || !topicName) {
      showError("⚠️ Please fill all required fields.");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/assessments/addassignment", {
        id:student,
        title:topicName,
        course: {
        description: description,
         
      },
      
      });

      showSuccess("✅ Topic assigned successfully!");
      setStudent("");
      setTopicName("");
      setDescription("");
      setaddtopicsValidation(true);
      loadTopics();
    } catch (error) {
     showError("Error assigning topic:", error);
     
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="assign-wrapper">
          <h3 className="assign-title">Assign New Chapter to Student</h3>

          <div className="assign-card">
            <form onSubmit={handleAssign}>
              <input
                type="text"
                className="assign-input"
                placeholder="Student Name or ID"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
              />

              <input
                type="text"
                className="assign-input"
                placeholder="Chapter Name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />

              <textarea
                className="assign-textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button className="assign-btn" type="submit">
                ➕ Assign Topic
              </button>
            </form>
          </div>

          {addtopicsValidation && (
            <>
              <h4 className="assign-title" style={{ marginTop: 20 }}>
                Assigned Topics
              </h4>

              <table className="assign-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Topic</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {topics.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", padding: 12 }}>
                        No topics assigned yet.
                      </td>
                    </tr>
                  ) : (
                    topics.map((t, i) => (
                      <tr key={i}>
                        <td>{t.student}</td>
                        <td>{t.topicName}</td>
                        <td>{t.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
