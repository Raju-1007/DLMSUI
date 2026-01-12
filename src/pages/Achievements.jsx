import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CertificateTemplate from "../Certificates/CertificateTemplate";
import { useMessage } from "../context/MessageContext"; 



export default function Achievements() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useMessage();

  // PDF logic states
  const [selectedItem, setSelectedItem] = useState(null);
  const [pdfAction, setPdfAction] = useState(""); // view | download
  const pdfRef = useRef();

  // FALLBACK DATA
  const fallback = [
    {
      subject: "Mathematics",
      date: "20/5/2025",
      competition: "World maths Day",
      grade: "B+",
      completed: "100%",
      status: "Completed",
    },
    {
      subject: "Science",
      date: "18/11/2025",
      competition: "Winter Science Competition",
      grade: "A",
      completed: "90%",
      status: "In Progress",
    },
    {
      subject: "Social",
      date: "22/12/2025",
      competition: "School Essay Competition",
      grade: "A",
      completed: "95%",
      status: "Upcoming",
    },
    {
      subject: "Hindi",
      date: "12/10/2025",
      competition: "Global Essay Competition",
      grade: "A",
      completed: "100%",
      status: "Completed",
    },
  ];

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/api/achievements/1"
      );
      setItems(res.data.length ? res.data : fallback);
    } catch {
      setItems(fallback);
    }
  };

  const filtered = items.filter((i) =>
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  // PDF GENERATION (COMMON)
  const generatePDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    if (pdfAction === "view") {
      window.open(pdf.output("bloburl"), "_blank");
    } else {
      pdf.save("certificate.pdf");
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="achievement-wrapper">
          <h2 className="achievement-title">My Achievements / Certificates</h2>

          <div className="achievement-card">
            <div className="achievement-header-row">
              <h4 className="student-name">
                KRISHNA VARMA.P - 092820
              </h4>

              <div className="right-controls">
                <div className="search-box">
                  <img
                    src="/images/searchicon.png"
                    alt="search"
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
            </div>

            <table className="achievement-table">
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>DATE</th>
                  <th>COMPETITION</th>
                  <th>GRADE</th>
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
                    <td>{item.competition}</td>
                    <td>{item.grade}</td>

                    <td className="report-links">
                      {/* VIEW CERTIFICATE */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPdfAction("view");
                          setSelectedItem(item);
                          setTimeout(generatePDF, 200);
                        }}
                      >
                        View Certificate
                      </a>
                      <br />

                      {/* DOWNLOAD CERTIFICATE */}
                      <a
                        href="#"
                        className="download-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setPdfAction("download");
                          setSelectedItem(item);
                          setTimeout(generatePDF, 200);
                        }}
                      >
                        Download Certificate
                      </a>
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

      {/* HIDDEN PDF CONTENT – NO UI IMPACT */}
      {selectedItem && (
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <CertificateTemplate ref={pdfRef} item={selectedItem} />
        </div>
      )}
    </div>
  );
}
