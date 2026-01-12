// src/pages/FeedbackPage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 

export default function FeedbackPage() {

  const { showSuccess, showError } = useMessage();
  const [feedback, setFeedback] = useState(null);

  // Hardcoded fallback (If API fails)
  const fallback = {
    id: 4,
    title: "Feedback is now available for your recent assignment.",
    serial: "Sl.No 4",
    sections: [
      {
        heading: "Positive Feedback",
        points: [
          "Great work! You demonstrated a strong understanding of key mathematical concepts.",
          "Excellent accuracy in solving problems — your steps were clear and logical.",
        ],
      },
      {
        heading: "Constructive Feedback",
        points: [
          "Good effort, but try to double-check your calculations to avoid small errors.",
          "You understood the concepts well, but your solution steps need more detail.",
        ],
      },
      {
        heading: "Specific Skill-based Feedback",
        points: [
          "Your algebra skills are strong; keep practicing equations and simplifications.",
          "Geometry section needs a bit more focus — review angles and shapes.",
        ],
      },
    ],
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/feedback/details/4");

      if (res.data) {
        setFeedback(res.data);
      } else {
        setFeedback(fallback);
      }
    } catch(err) {
       showError("Feedback API failed → using fallback");
      setFeedback(fallback);
    }
  };

  if (!feedback) return null;

  return (
    <div>
      <Navbar />

      <div className="feedback-layout">
        <Sidebar />

        <div className="feedback-content">
          <div className="feedback-box">

            {/* Header Blue Bar */}
            <div className="feedback-header">
              <span>
                {feedback.serial}  -  {feedback.title}
              </span>
              <button className="feedback-close">✕</button>
            </div>

            {/* SECTIONS */}
            <div className="feedback-body">
              {feedback.sections.map((sec, index) => (
                <div key={index} className="feedback-section">
                  <h3>{sec.heading}</h3>

                  <ul>
                    {sec.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
