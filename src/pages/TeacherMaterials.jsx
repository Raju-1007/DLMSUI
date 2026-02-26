


// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import axios from "axios";

// import { useMessage } from "../context/MessageContext"; 


// export default function TeacherMaterials() {
//   const [materials, setMaterials] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [loginDetails, setLoginDetails] = useState({});
//   const { showSuccess, showError } = useMessage();

//   // Upload fields
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("PDF");
//   const [file, setFile] = useState(null);

//   // Assign Popup
//   const [showPopup, setShowPopup] = useState(false);
//   const [assignTarget, setAssignTarget] = useState("ALL");
//   const [selectedId, setSelectedId] = useState("");
//   const [studentInfo, setStudentInfo] = useState({});

//   const [assignData, setAssignData] = useState({
//     materialKey: "",
//     materialTitle: "",
//   });

//   // Load login + students on mount
//   useEffect(() => {
//     const login = JSON.parse(localStorage.getItem("loginDetails"));
//     setLoginDetails(login);

//     loadStudents();
//   }, []);

//   // -------------------------------
//   // LOAD STUDENTS
//   // -------------------------------
//   const loadStudents = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/studentData");
//       setStudents(res.data || []);
//     } catch (e) {
//       setStudents([]);
//     }
//   };

//   // -------------------------------
//   // UPLOAD MATERIAL
//   // -------------------------------
//   const saveMaterial = async (e) => {
//     e.preventDefault();

//     if (!title || !file) {
//       showError("Please fill all fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("type", type);
//     formData.append("teacherid", loginDetails.loginId)

//     try {
//       const res = await axios.post(import.meta.env.VITE_API_BASE_URL+"/content/upload", formData);

//       const materialKey = res.data.key;

//       // Add to Material Library (UI only)
//       setMaterials((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           title: title,
//           type: type,
//           key: materialKey
//         },
//       ]);

//       showSuccess("Material uploaded successfully!");
//       setTitle("");
//       setType("PDF");
//       setFile(null);

//     } catch (e) {
//       console.log(e);
//       showSuccess("Upload failed");
//     }
//   };

//   // -------------------------------
//   // OPEN ASSIGN POPUP
//   // -------------------------------
//   const assignMaterial = (material) => {
//     setShowPopup(true);
//     setAssignTarget("ALL");
//     setSelectedId("");

//     setAssignData({
//       materialKey: material.key,
//       materialTitle: material.title,
//     });

//     setStudentInfo({});
//   };

//   // -------------------------------
//   // FETCH STUDENT NAME WHEN ID SELECTED
//   // -------------------------------
//   const handleStudentChange = async (id) => {
//     setSelectedId(id);

//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+`/api/roles/student/${id}`);
//       setStudentInfo(res.data || {});
//     } catch {
//       setStudentInfo({});
//     }
//   };

//   // -------------------------------
//   // SUBMIT ASSIGN API
//   // -------------------------------
//   const submitAssign = async () => {

//     const payload = {
//       materialKey: assignData.materialKey,
//       title: assignData.materialTitle,
//       type: type,
//       teacherId: loginDetails.loginId,
//       assignType: assignTarget, // ALL / ONE / CLASS
//       studentId: selectedId || null,
//       className: loginDetails.className || "XI",
//     };

//     try {
//       await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/assign", payload);
//       showSuccess("Material assigned successfully!");
//       setShowPopup(false);
//     } catch (e) {
//       console.log(e);
//       showError("Assign failed");
//     }
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="teacher-layout">
//         <Sidebar />

//         <div className="teacher-main">
//           <h2 className="teacher-page-title">Learning Materials</h2>

//           {/* ---------- UPLOAD SECTION ----------- */}
//           <div className="teacher-card">
//             <h3 className="teacher-card-title">Upload / Link Material</h3>

//             <form className="teacher-form" onSubmit={saveMaterial}>
//               <div className="teacher-form-row">
//                 <label>Title</label>
//                 <input value={title} onChange={(e) => setTitle(e.target.value)} />
//               </div>

//               <div className="teacher-form-row">
//                 <label>Type</label>
//                 <select value={type} onChange={(e) => setType(e.target.value)}>
//                   <option value="PDF">PDF</option>
//                   <option value="Video">Video</option>
//                   <option value="Image">Image</option>
//                 </select>
//               </div>

//               <div className="teacher-form-row">
//                 <label>File Upload</label>
//                 <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//               </div>

//               <div className="teacher-form-actions">
//                 <button className="teacherSaveMaterials">Save Material</button>
//               </div>
//             </form>
//           </div>

//           {/* ---------- MATERIAL LIBRARY ----------- */}
//           <div className="teacher-card">
//             <h3 className="teacher-card-title">Material Library</h3>

//             <table className="teacher-table">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Type</th>
//                   <th>View</th>
//                   <th>Assign</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {materials.map((m) => (
//                   <tr key={m.id}>
//                     <td>{m.title}</td>
//                     <td>{m.type}</td>
//                     <td>
//                       <a
//                         href={import.meta.env.VITE_API_BASE_URL+`/api/content/stream?key=${m.key}`}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Open
//                       </a>
//                     </td>
//                     <td>
//                       <button
//                         className="ts-assign-btn"
//                         onClick={() => assignMaterial(m)}
//                       >
//                         Assign
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ---------- ASSIGN POPUP ---------- */}
//       {showPopup && (
//         <div className="ts-overlay" onClick={() => setShowPopup(false)}>
//           <div className="ts-popup" onClick={(e) => e.stopPropagation()}>
//             <h3 className="ts-popup-title">
//               Assign Material — {assignData.materialTitle}
//             </h3>

//             <label>Assign To</label>
//             <select value={assignTarget} onChange={(e) => setAssignTarget(e.target.value)}>
//               <option value="ALL">All Students</option>
//               <option value="ONE">Specific Student</option>
//               <option value="CLASS">Class</option>
//             </select>

//             {assignTarget === "ONE" && (
//               <>
//                 <label>Select Student</label>
//                 <select value={selectedId} onChange={(e) => handleStudentChange(e.target.value)}>
//                   <option value="">Select Student</option>
//                   {students.map((s) => (
//                     <option key={s.loginid} value={s.loginid}>
//                       {s.loginid} — {s.fullName}
//                     </option>
//                   ))}
//                 </select>

//                 <label>Name</label>
//                 <input value={studentInfo.fullName || ""} readOnly />

//                 <label>Class</label>
//                 <input value={studentInfo.className || ""} readOnly />
//               </>
//             )}

//             <div className="ts-popup-actions">
//               <button className="ts-btn ts-cancel" onClick={() => setShowPopup(false)}>
//                 Cancel
//               </button>
//               <button className="ts-btn ts-submit" onClick={submitAssign}>
//                 Assign
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";

export default function TeacherMaterials() {
  const { showSuccess, showError } = useMessage();

  const [materials, setMaterials] = useState([]);
  const [loginDetails, setLoginDetails] = useState({});
  const [teacherProfile, setTeacherProfile] = useState({});

  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [file, setFile] = useState(null);
  const [className, setClassName] = useState("");
  const[subjectName,setSubjectName]=useState("");

  /* ================= LOAD LOGIN ================= */
  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));
    if (login) {
      setLoginDetails(login);
    }
  }, []);

  /* ================= LOAD PROFILE + MATERIALS ================= */
  useEffect(() => {
    if (!loginDetails?.userDetails?.loginid) return;

    loadProfile(loginDetails.userDetails.loginid);
    loadMaterials(loginDetails.userDetails.loginid);

  }, [loginDetails]);

  const loadProfile = async (teacherId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${teacherId}`
      );

      setTeacherProfile(res.data);
      setClassName(res.data?.className || "");
      setSubjectName(res.data?.subjectName || "")
    } catch {
      showError("Failed to load teacher profile");
    }
  };

  const loadMaterials = async (teacherId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/teacher/${teacherId}`
      );

      setMaterials(res.data || []);
    } catch {
      showError("Failed to load materials");
      setMaterials([]);
    }
  };

  /* ================= SAVE MATERIAL ================= */
  const saveMaterial = async (e) => {
    e.preventDefault();

    if (!title || !file || !className) {
      showError("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("className", className);
    formData.append("teacherId", loginDetails.userDetails.loginid);
     formData.append("subjectName", subjectName);
    

    try {
      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/content/upload",
        formData
      );

      showSuccess("Material uploaded successfully");

      setTitle("");
      setType("PDF");
      setFile(null);

      // refresh table after upload
      loadMaterials(loginDetails.userDetails.loginid);

    } catch {
      showError("Upload failed");
    }
  };

  /* ================= OPEN FILE ================= */
  const openFile = (material) => {
    const fileUrl =
      material.pdfPath
        ? material.pdfPath
        : material.videoPath
        ? material.videoPath
        : material.imagePath;

    if (!fileUrl) {
      showError("File not available");
      return;
    }

    window.open(
      import.meta.env.VITE_API_BASE_URL + fileUrl,
      "_blank"
    );
  };

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2 className="teacher-page-title">Learning Materials</h2>

          {/* ================= UPLOAD SECTION ================= */}
          <div className="teacher-card">
            <h3 className="teacher-card-title">Upload Material</h3>

            <form className="teacher-form" onSubmit={saveMaterial}>
              <div className="teacher-form-row">
                <label>Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="teacher-form-row">
                <label>Class</label>
                <input value={className} readOnly />
              </div>
              <div className="teacher-form-row">
                <label>SubjectName</label>
                <input value={subjectName} readOnly />
              </div>


              

              <div className="teacher-form-row">
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                </select>
              </div>

              <div className="teacher-form-row">
                <label>File Upload</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="teacher-form-actions">
                <button type="submit" className="teacherSaveMaterials">
                  Save Material
                </button>
              </div>
            </form>
          </div>

          {/* ================= MATERIAL LIST ================= */}
          <div className="teacher-card">
            <h3 className="teacher-card-title">Material Library</h3>

            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No materials found
                    </td>
                  </tr>
                ) : (
                  materials.map((m) => (
                    <tr key={m.id}>
                      <td>{m.title}</td>
                      <td>{m.className || "Not Assigned"}</td>
                      <td>{m.type}</td>
                      <td>
                        <button onClick={() => openFile(m)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
