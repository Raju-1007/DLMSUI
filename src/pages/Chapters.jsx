import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageContext";
 

export default function Chapters() {
const { showSuccess, showError } = useMessage();
  const [chapters, setChapters] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const nav = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+`/api/chapters/getByCourse/${courseId}`
      );
      setChapters(res.data || []);
    } catch(err) {
       showError("Error loading chapters", err);
    }
  };

  const addChapter = async (e) => {
    e.preventDefault();
    if (!chapterName.trim()) return showSuccess("Enter chapter name");

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/chapters/addChapter", {
        title: chapterName,
        courseId: courseId,
      });

      setChapterName("");
      setShowDialog(false);
      loadChapters();
    } catch(err) {
       showError("Error adding chapter", err);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="chapter-container">
          <div className="chapter-header">
            <h2>📘 Chapters</h2>
            {/* <button className="add-btn" onClick={() => setShowDialog(true)}>
              + Add Chapter
            </button> */}
            <button  className="add-btn" onClick={() => nav(`/Chapters`)}>+ Add Chapter</button>
          </div>

          <div className="chapter-list">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="chapter-card"
                onClick={() => nav(`/assignments/${ch.id}`)}
              >
                <div className="chapter-title">{ch.title}</div>
                <div className="chapter-sub">
                  Click to manage assignments ➜
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Add New Chapter</h3>

            <form onSubmit={addChapter}>
              <input
                type="text"
                placeholder="Enter chapter name"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="modal-input"
              />

              <div className="modal-actions">
                <button className="save-btn">Save</button>
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
