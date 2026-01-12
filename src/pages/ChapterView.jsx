// import React, { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import axios from "axios";

// export default function ChapterView() {
//   const { id, chapterId } = useParams();

//   const [file, setFile] = useState(null);
//   const [fileURL, setFileURL] = useState(null);
//   const [fileType, setFileType] = useState("");

//   const [uploading, setUploading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   // ✅ Handle file select
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setFileURL(URL.createObjectURL(selectedFile));

//       if (selectedFile.type.includes("video")) setFileType("video");
//       else if (selectedFile.type.includes("pdf")) setFileType("pdf");
//       else setFileType("");
//     }
//   };

//   // ✅ Handle upload
//   const handleUpload = async () => {
//     if (!file) {
//       showError("pleaseselect a file before uploading.");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);
//     // formData.append("courseId", id);
//     // formData.append("chapterId", chapterId);

//     try {
//       await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       showSuccess("✅ File uploaded successfully!");
//       setFile(null);
//       setFileURL(null);
//       setFileType("");

//       // optional reload from backend
//       const res = await axios.get(
//         import.meta.env.VITE_API_BASE_URL+`/api/getfiles/${id}/${chapterId}`
//       );
//       setUploadedFiles(res.data);
//     } catch (error) {
//      showError("Upload failed:", error);
//       showSuccess("❌ Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ✅ Handle remove
//   const handleRemoveFile = () => {
//     setFile(null);
//     setFileURL(null);
//     setFileType("");
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
//         <Sidebar />
//         <div style={{ padding: 16 }}>
//           <h2>
//             Course {id} – Chapter {chapterId}
//           </h2>

//           {/* Upload Section */}
//           <div
//             className="card"
//             style={{
//               height: 320,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               flexDirection: "column",
//               border: "1px solid #ccc",
//               borderRadius: 8,
//               backgroundColor: "#f9f9f9",
//               padding: 16,
//             }}
//           >
//             {/* ✅ If no file is selected */}
//             {!file ? (
//               <>
//                 <p>PDF/Video content placeholder</p>
//                 <label
//                   htmlFor="fileUpload"
//                   style={{
//                     cursor: "pointer",
//                     padding: "8px 16px",
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     borderRadius: 5,
//                     marginTop: 10,
//                   }}
//                 >
//                   Upload PDF/Video
//                 </label>
//                 <input
//                   id="fileUpload"
//                   type="file"
//                   accept="video/*,application/pdf"
//                   style={{ display: "none" }}
//                   onChange={handleFileChange}
//                 />
//               </>
//             ) : (
//               <>
//                 {/* ✅ File preview */}
//                 {fileType === "video" && (
//                   <video
//                     src={fileURL}
//                     controls
//                     style={{ width: "100%", height: "80%", borderRadius: 8 }}
//                   />
//                 )}
//                 {fileType === "pdf" && (
//                   <iframe
//                     src={fileURL}
//                     title="PDF Preview"
//                     style={{
//                       width: "100%",
//                       height: "80%",
//                       borderRadius: 8,
//                       border: "none",
//                     }}
//                   ></iframe>
//                 )}

//                 {/* ✅ Action buttons */}
//                 <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
//                   <button
//                     onClick={handleUpload}
//                     disabled={uploading}
//                     style={{
//                       backgroundColor: "#2825f0",
//                       color: "white",
//                       border: "none",
//                       padding: "8px 16px",
//                       borderRadius: 5,
//                       cursor: "pointer",
//                     }}
//                   >
//                     {uploading ? "Uploading..." : "Upload"}
//                   </button>

//                   <button
//                     onClick={handleRemoveFile}
//                     style={{
//                       backgroundColor: "#dc3545",
//                       color: "white",
//                       border: "none",
//                       padding: "8px 16px",
//                       borderRadius: 5,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Remove File
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Action Links */}
//           <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//             <Link className="btn" to={`/chapter/${chapterId}/quiz`}>
//               Take Quiz
//             </Link>
//             <Link className="btn" to={`/chapter/${chapterId}/feedback`}>
//               Feedback
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// // import React, { useState, useEffect } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import Navbar from "../components/Navbar";
// // import Sidebar from "../components/Sidebar";
// // import axios from "axios";


// // export default function ChapterView() {
// //   const { id, chapterId } = useParams();

// //   const [file, setFile] = useState(null);
// //   const [fileURL, setFileURL] = useState(null);
// //   const [fileType, setFileType] = useState("");
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadedFiles, setUploadedFiles] = useState([]);

// //   useEffect(() => {
// //     // load uploaded files for chapter (if API exists)
// //     (async () => {
// //       try {
// //         const res = await axios.get(import.meta.env.VITE_API_BASE_URL+`/api/getfiles/${id}/${chapterId}`);
// //         setUploadedFiles(res.data || []);
// //       } catch (e) { /* ignore */ }
// //     })();
// //   }, [id, chapterId]);

// //   const handleFileChange = (e) => { /* same as before */ 
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       setFile(selectedFile);
// //       setFileURL(URL.createObjectURL(selectedFile));
// //       if (selectedFile.type.includes("video")) setFileType("video");
// //       else if (selectedFile.type.includes("pdf")) setFileType("pdf");
// //       else setFileType("");
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!file) return showError("pleaseselect a file");
// //     setUploading(true);
// //     const formData = new FormData();
// //     formData.append("file", file);
// //     try {
// //       await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/upload", formData, { headers: { "Content-Type": "multipart/form-data" }});
// //       showSuccess("File uploaded successfully!");
// //       setFile(null); setFileURL(null); setFileType("");
// //       // refresh uploaded files
// //       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+`/api/getfiles/${id}/${chapterId}`);
// //       setUploadedFiles(res.data || []);
// //     } catch(err) {
// //       console.error(err); showSuccess("Upload failed");
// //     } finally { setUploading(false); }
// //   };

// //   return (
// //     <div>
// //       <Navbar />
// //       <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
// //         <Sidebar />
// //         <div style={{ padding: 20 }}>
// //           <h2 style={{ marginBottom:12 }}>Course {id} – Chapter {chapterId}</h2>

// //           <div className="upload-card">
// //             {!file ? (
// //               <>
// //                 <p style={{margin:0}}>PDF / Video content placeholder</p>
// //                 <label htmlFor="fileUpload" className="upload-btn">Upload PDF/Video</label>
// //                 <input id="fileUpload" type="file" accept="video/*,application/pdf" style={{display:"none"}} onChange={handleFileChange} />
// //               </>
// //             ) : (
// //               <>
// //                 {fileType === "video" && <video src={fileURL} controls className="preview-media" />}
// //                 {fileType === "pdf" && <iframe src={fileURL} title="PDF Preview" className="preview-media" />}
// //                 <div style={{display:"flex",gap:10, marginTop:12}}>
// //                   <button className="btn primary" onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
// //                   <button className="btn" onClick={() => { setFile(null); setFileURL(null); setFileType(""); }}>Remove</button>
// //                 </div>
// //               </>
// //             )}
// //           </div>

// //           <div style={{marginTop:14, display:"flex", gap:8}}>
// //             <Link className="btn" to={`/chapter/${chapterId}/quiz`}>assignment</Link>
// //             <Link className="btn" to={`/chapter/${chapterId}/feedback`}>Feedback</Link>
// //           </div>

// //           {/* Uploaded files list (if any) */}
// //           {uploadedFiles.length > 0 && (
// //             <div style={{marginTop:18}}>
// //               <h4>Uploaded Files</h4>
// //               <ul>
// //                 {uploadedFiles.map(f => <li key={f.id}><a href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>)}
// //               </ul>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaDownload } from "react-icons/fa";
import { FiChevronRight, FiX } from "react-icons/fi";

import { useMessage } from "../context/MessageContext"; 


export default function ChapterView() {

  const { showSuccess, showError } = useMessage();
  const nav = useNavigate();
  const videoRef = useRef(null);
  const { courseId, title } = useParams();
   const courseTitle = decodeURIComponent(title);

  /* ================= STATES ================= */
  const [pdfMaterial, setPdfMaterial] = useState(null);
  const [videoMaterial, setVideoMaterial] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentView, setCurrentView] = useState(""); // VIDEO | PDF
  const [progress, setProgress] = useState(0);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));

    if (login?.loginId) {
       localStorage.setItem("courseTitle", courseTitle);
      loadStudentMaterial(login.loginId);
    }

    return () => {
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= FETCH MATERIAL ================= */
  const loadStudentMaterial = async (id) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+`/api/content/assigned/student/${id}`
      );

      if (!res.data || res.data.length === 0) return;

      // 🔥 Detect by file extension
      const pdf = res.data.find((m) =>
        m.materialKey.toLowerCase().endsWith(".pdf")
      );
        
      const video = res.data.find((m) =>
        m.materialKey.toLowerCase().endsWith(".mp4")
      );

      setPdfMaterial(pdf || null);
      setVideoMaterial(video || null);
      console.log(pdfMaterial.materialKey," :::::::::::::: console.log(pdf)");
      /* ===== LOAD PDF AS BLOB ===== */
      if (pdf) {
        const pdfRes = await axios.get(
          import.meta.env.VITE_API_BASE_URL+`/api/content/download?key=${pdfMaterial.materialKey}`,
          { responseType: "blob" }
        );
      

        const blobUrl = URL.createObjectURL(
          new Blob([pdfRes.data], { type: "application/pdf" })
        );

        setPdfUrl(blobUrl);
      }

      /* ===== INITIAL VIEW ===== */
      if (video) {
        setCurrentView("VIDEO"); // ▶ start with video
      } else if (pdf) {
        setCurrentView("PDF");
      }

      if (video && pdf) {
        showSuccess("You received both Video and PDF material");
      }
    } catch(err) {
       showError(err);
      showError("Failed to load content");
    }
  };

  /* ================= VIDEO EVENTS ================= */
  const handleVideoProgress = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress(Math.floor((vid.currentTime / vid.duration) * 100));
  };

  // ▶ Video finished → show PDF
  const handleVideoEnd = () => {
    if (pdfMaterial) {

      setCurrentView("PDF");
    }
  };

  /* ================= DOWNLOAD ================= */
  const downLoadMaterial = async () => {
    const material = pdfMaterial || videoMaterial;
    if (!material) return;

    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL+`/api/content/download?key=${material.materialKey}`,
      { responseType: "blob" }
    );

    const fileName = material.materialKey.split("/").pop();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.click();
  };

  localStorage.setItem
  return (
    <div>
      <Navbar />

      <div className="chapter-layout">
        <Sidebar />

        <div className="chapter-content">
          <div className="breadcrumb">
            Courses &gt;{" "}
            <span>{courseTitle}</span>
            {/* <span>{pdfMaterial?.title || videoMaterial?.title}</span> */}
          </div>

          <div className="chapter-main">
            {/* LEFT */}
            <div className="chapter-left">
              <div className="subject-card">
                <h3>{pdfMaterial?.title || videoMaterial?.title}</h3>

                <div className="progress-circle">
                  <div className="progress-value">{progress}</div>
                </div>

                <a className="view-details">View Details ↓</a>
              </div>

              <div className="chapter-list">
                <p className="chapter-item">Chapter 1</p>
                <p className="chapter-item">Chapter 2</p>
                <p className="chapter-item">Chapter 3</p>
                <p className="chapter-item">Chapter 4</p>
                <p className="chapter-item">Chapter 5</p>

                <p className="chapter-item active">
                  Chapter 6 <FiChevronRight size={16} />
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="chapter-right">
              <h2 className="chapter-title">CHAPTER 6</h2>

              {/* ================= VIDEO VIEW ================= */}
              {currentView === "VIDEO" && videoMaterial && (
                <div style={{ position: "relative" }}>
                  {/* CLOSE VIDEO → OPEN PDF */}
                  {pdfMaterial && (
                    <button
                      onClick={() => setCurrentView("PDF")}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                    >
                      <FiX />
                    </button>
                  )}

                  <video
                    ref={videoRef}
                    src={import.meta.env.VITE_API_BASE_URL+`/api/content/stream?key=${videoMaterial.materialKey}`}
                    controls
                    autoPlay
                    onTimeUpdate={handleVideoProgress}
                    onEnded={handleVideoEnd}
                    poster="/images/videoimage.png"
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                </div>
              )}

              {/* ================= PDF VIEW ================= */}
              {currentView === "PDF" && pdfUrl && (
                <div style={{ position: "relative" }}>
                  {/* CLOSE PDF → BACK TO VIDEO */}
                  {videoMaterial && (
                    <button
                      onClick={() => setCurrentView("VIDEO")}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                    >
                      <FiX />
                    </button>
                  )}

                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="450px"
                    title="PDF Viewer"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
              )}

              <button className="download-btn" onClick={downLoadMaterial}>
                <FaDownload size={14} /> Download
              </button>

              <div className="bottom-buttons">
                <button
                  className="assignment-btn"
                  onClick={() => nav("/chapter")}
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
