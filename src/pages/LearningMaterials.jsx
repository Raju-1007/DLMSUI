import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 

export default function LearningMaterials() {
  const { showSuccess, showError } = useMessage();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const[studentProgress,setStudentProgress]=useState("");
  
   
  useEffect(() => {
      let progress=localStorage.getItem('progress')
       setStudentProgress(progress);
    loadMaterials();
  }, [studentProgress]);

  // HARD CODED FALLBACK DATA
  const fallback = [
    {
      subject: "Mathematics",
      date: "20/5/2025",
      type: "Videos",
      report: "View Material",
      download: "Download Material",
      completed: studentProgress,
      status: "Completed",
    },
    {
      subject: "Science",
      date: "18/11/2025",
      type: "PDF",
      report: "View Material",
      download: "Download Material",
      completed: studentProgress,
      status: "In Progress",
    },
    {
      subject: "Social",
      date: "22/12/2025",
      type: "PDF",
      report: "View Material",
      download: "Download Material",
      completed: studentProgress,
      status: "Upcoming",
    },
    {
      subject: "Hindi",
      date: "12/10/2025",
      type: "Videos",
      report: "View Material",
      download: "Download Material",
      completed: studentProgress,

      status: "Completed",
    },
  ];
 

  // API GET
  const loadMaterials = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/materials/1");
      setItems(res.data.length ? res.data : fallback);
    } catch (e) {
      setItems(fallback);
    }
  };

  // SEARCH FILTER
  const filtered = items.filter((i) =>
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="lm-wrapper">
          <h2 className="lm-title">Learning Materials</h2>

          <div className="lm-card">
            <div className="lm-header-row">
              <h4 className="student-name">KRISHNA VARMA.P - 092820</h4>

              <div className="right-controls">
                <img
                  src="/images/searchicon.png"
                  alt="calendar"
                  className="calendar-icon"
                />

                <input
                  type="text"
                  placeholder="Search course"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <table className="lm-table">
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>DATE</th>
                  <th>MATERIAL TYPE</th>
                  <th>REPORTS</th>
                  <th>COURSE COMPLETED (%)</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i}>
                    <td>{item.subject}</td>
                    <td>{item.date}</td>
                    <td>{item.type}</td>

                    <td className="report-links">
                      <a href="/chapterviews">{item.report}</a>
                      <br />
                      {/* <a href="/chapterviews" className="download-link">
                        {item.download}
                      </a> */}
                    </td>

                    <td>{item.completed}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Completed"
                            ? "completed"
                            : item.status === "Upcoming"
                            ? "upcoming"
                            : "progress"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
