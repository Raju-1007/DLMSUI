import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaDownload } from "react-icons/fa";
import { FiChevronRight, FiX } from "react-icons/fi";
import { useMessage } from "../context/MessageContext";
import moment from "moment";

export default function ChapterView() {

  const { showError, showSuccess } = useMessage();
  const nav = useNavigate();
  const videoRef = useRef(null);
  const { title } = useParams();
  const courseTitle = decodeURIComponent(title);

  const [material, setMaterial] = useState(null);
  const [currentView, setCurrentView] = useState("");
  const [progress, setProgress] = useState(0);
  const [loginId, setLoginId] = useState(null);
  const [loginDetails, setLoginDetails] = useState(null);

  /* ================= LOAD STUDENT + MATERIAL ================= */

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));

    if (login?.userDetails) {
      setLoginDetails(login.userDetails);
      setLoginId(login.userDetails.loginid);

      if (login.userDetails.loginid) {
        loadStudentDetails(login.userDetails.loginid);
      }
    }
  }, []);

  const loadStudentDetails = async (studentId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/getClassDetails/${studentId}`
      );

      if (res.data?.className) {
        loadStudentMaterial(res.data.className);
      }
    } catch (err) {
      showError("Failed to load student details");
    }
  };

  const loadStudentMaterial = async (className) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/getMaterailDetails`,
        {
          params: {
            subjectName: courseTitle,
            className: className,
          },
        }
      );

      if (!res.data || res.data.length === 0) return;

      const mat = res.data[0];
      setMaterial(mat);

      if (mat.videoPath?.endsWith(".mp4")) {
        setCurrentView("VIDEO");
      } else if (mat.pdfPath?.endsWith(".pdf")) {
        setCurrentView("PDF");
      } else if (mat.imagePath) {
        setCurrentView("IMAGE");
      }
    } catch (err) {
      showError("Failed to load content");
    }
  };

  /* ================= VIDEO PROGRESS ================= */

  const handleVideoProgress = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress(Math.floor((vid.currentTime / vid.duration) * 100));
  };

  const handleVideoEnd = async () => {
    await handleAttendance();

    if (material?.pdfPath) {
      setCurrentView("PDF");
    }
  };

  /* ================= ATTENDANCE ================= */

  const handleAttendance = async () => {
    if (!loginDetails) return;

    const payload = {
      studentId: loginDetails.loginid,
      studentName: loginDetails.fullName,
      subjectName: courseTitle,
      attendance: "Active",
       date: moment().format("YYYY-MM-DD"),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/addAttendance`,
        payload
      );

      showSuccess("Attendance added successfully");
    } catch (err) {
      showError("Unable to add attendance");
    }
  };

  /* ================= DOWNLOAD ================= */

  const downLoadMaterial = async () => {
    if (!material) return;

    try {
      const filePath =
        material.pdfPath ||
        material.videoPath ||
        material.imagePath;

      const fileName = filePath.split("/").pop();

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/download`,
        {
          params: {
            filePath: fileName,
            type: material.type,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      showError("Download failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="chapter-layout">
        <Sidebar />

        <div className="chapter-content">
          <div className="breadcrumb">
            Courses &gt; <span>{courseTitle}</span>
          </div>

          <div className="chapter-main">

            {/* LEFT PANEL */}
            <div className="chapter-left">
              <div className="subject-card">
                <h3>{material?.title}</h3>

                <div className="progress-circle">
                  <div className="progress-value">
                    {currentView === "VIDEO"
                      ? `${progress}%`
                      : "100%"}
                  </div>
                </div>
              </div>

              <div className="chapter-list">
                <p className="chapter-item active">
                  Chapter 1 <FiChevronRight size={16} />
                </p>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="chapter-right">
              <h2 className="chapter-title">CHAPTER</h2>

              {/* VIDEO */}
              {currentView === "VIDEO" && material?.videoPath && (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  onTimeUpdate={handleVideoProgress}
                  onEnded={handleVideoEnd}
                  style={{ width: "100%", borderRadius: "12px" }}
                >
                  <source
                    src={`${import.meta.env.VITE_API_BASE_URL}/content/stream?filename=${encodeURIComponent(
                      material.videoPath.split("/").pop()
                    )}`}
                    type="video/mp4"
                  />
                </video>
              )}

              {/* PDF */}
              {currentView === "PDF" && material?.pdfPath && (
                <iframe
                  src={`${import.meta.env.VITE_API_BASE_URL}/content/stream?path=${material.pdfPath}`}
                  width="100%"
                  height="500px"
                  title="PDF Viewer"
                  style={{ borderRadius: "12px" }}
                />
              )}

              {/* IMAGE */}
              {currentView === "IMAGE" && material?.imagePath && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/content/stream?path=${material.imagePath}`}
                  alt="Material"
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              )}

              <button className="download-btn" onClick={downLoadMaterial}>
                <FaDownload size={14} /> Download
              </button>

              <div className="bottom-buttons">
                <button
                  className="assignment-btn"
                  onClick={() =>
                    nav(`/chapter/${loginId}/quiz`, {
                      state: { courseTitle },
                    })
                  }
                >
                  Take Assignment
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
