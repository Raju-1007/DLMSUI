import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 
export default function ProgressReport() {
  // ✅ Add as many subjects as needed here
  const { showSuccess, showError } = useMessage();
  const [data, setData] = useState([
    { course: "Mathematics", pct: 0 },
    { course: "Physics", pct: 0 },
    // { course: "Chemistry", pct: 0 },
    // { course: "Biology", pct: 0 },
    // { course: "English", pct: 0 },
    // { course: "Computer Science", pct: 0 },
  ]);

  const [students, setStudents] = useState([]);

  // 🧠 Handle slider movement
  const handleSliderChange = (index, newValue) => {
    const updatedData = [...data];
    updatedData[index].pct = newValue;
    setData(updatedData);
  };


  // 💾 Save button handler (you can later connect this to backend)
  const handleSaveProgress = async () => {
  try {
    for (let item of data) {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/progress/addProgress", {
        percent: item.pct,             // ✔ progress value
        // contentItem: {
        //   title: item.course          // ✔ subject name
        // }
      });
    }

    showSuccess("Progress saved!");
  } catch (error) {
    console.error(error);
    showError("Error saving progress");
  }
};


  return (
    <div>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />
        <div style={{ padding: 16 }}>
          <h2>My Subject Progress</h2>

          {/* Loop through all subjects */}
          {data.map((d, i) => (
            <div
              key={i}
              className="card"
              style={{
                marginBottom: 15,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              {/* Title + % display */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <b>{d.course}</b>
                <span>{d.pct}%</span>
              </div>

              {/* Progress bar */}
              {/* <div
                style={{
                  height: 10,
                  background: "#eee",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${d.pct}%`,
                    height: "100%",
                    background: "var(--green, #16a34a)",
                    borderRadius: 6,
                    transition: "width 0.3s ease",
                  }}
                />
              </div> */}

              {/* Slider control */}
              <input
                type="range"
                min="0"
                max="100"
                value={d.pct}
                onChange={(e) => handleSliderChange(i, parseInt(e.target.value))}
                style={{
                  width: "100%",
                  marginTop: 10,
                  cursor: "pointer",
                }}
              />
            </div>
          ))}

          {/* Save button */}
          <button
            onClick={handleSaveProgress}
            style={{
              backgroundColor: "#2825f0",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: 5,
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            💾 Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}

