// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import axios from "axios";

// export default function TeacherMaterials() {
//   const [materials, setMaterials] = useState([]);
//   const [students, setStudents] = useState([]);

//   // Upload fields
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("PDF");
//   const [file, setFile] = useState(null);

//   // Popup
//   const [showPopup, setShowPopup] = useState(false);
//   const [assignTarget, setAssignTarget] = useState("ALL");
//   const [assignData, setAssignData] = useState({
//     materialKey: "",
//     materialTitle: "",
//     studentId: "",
//     studentName: "",
//     className: "",
//     subject: "",
//   });

//   useEffect(() => {
//     loadMaterials();
//     loadStudents();
//   }, []);

//   // ----------------------------------
//   // LOAD MATERIALS (mock for now)
//   // ----------------------------------
//   const loadMaterials = async () => {
//     try {
//       setMaterials([
//         { id: 1, title: "Algebra Notes – Chapter 6", type: "PDF", key: "abc1" },
//         { id: 2, title: "Science Video – Force & Motion", type: "Video", key: "xyz2" },
//       ]);
//     } catch {
//       setMaterials([]);
//     }
//   };

//   // ----------------------------------
//   // LOAD STUDENTS
//   // ----------------------------------
//   const loadStudents = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/teacher/students");
//       setStudents(res.data || []);
//     } catch {
//       setStudents([
//         { id: "092820", name: "Krishna Varma", className: "8A", subject: "Maths" },
//         { id: "092821", name: "Suresh", className: "8A", subject: "Science" },
//         { id: "092822", name: "Ravi", className: "7B", subject: "English" },
//       ]);
//     }
//   };

//   // ----------------------------------
//   // SAVE MATERIAL (UPLOAD)
//   // ----------------------------------
//   const saveMaterial = async (e) => {
//     e.preventDefault();

//     if (!title || !file) {
//       showError("pleaseenter all fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("type", type);

//     try {
//       const res = await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/upload", formData);

//       const materialKey = res.data.key;
//       localStorage.setItem("videoky", materialKey);

//       setMaterials((prev) => [
//         ...prev,
//         { id: Date.now(), title, type, key: materialKey },
//       ]);

//       showSuccess("Material uploaded successfully");
//       setTitle("");
//       setType("PDF");
//       setFile(null);
//     } catch {
//       showSuccess("Upload failed");
//     }
//   };

//   // ----------------------------------
//   // OPEN ASSIGN POPUP
//   // ----------------------------------
//   const assignMaterial = (material) => {
//     setShowPopup(true);
//     setAssignTarget("ALL");

//     setAssignData({
//       materialKey: material.key,
//       materialTitle: material.title,
//       studentId: "",
//       studentName: "",
//       className: "",
//       subject: "",
//     });
//   };

//   // ----------------------------------
//   // SUBMIT ASSIGN API
//   // ----------------------------------
//   const submitAssign = async () => {
//     if (assignTarget === "ONE" && !assignData.studentId) {
//       showSuccess("Select a student");
//       return;
//     }

//     const payload = {
//       materialKey: assignData.materialKey,
//       title: assignData.materialTitle,
//       type: type,
//       teacherId: localStorage.getItem("teacherId"),
//       assignType: assignTarget, // ALL / ONE / CLASS
//       studentId: assignData.studentId || null,
//       className: assignData.className || null,
//     };

//     console.log(payload,"payloadpayloadpayload================");

//     try {
//       await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/assign", payload);
//       showSuccess("Material assigned successfully!");
//       setShowPopup(false);
//     } catch (e) {
//       console.log(e);
//       showSuccess("Assign failed");
//     }
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="teacher-layout">
//         <Sidebar />

//         <div className="teacher-main">
//           <h2 className="teacher-page-title">Learning Materials</h2>

//           {/* UPLOAD SECTION */}
//           <div className="teacher-card">
//             <h3 className="teacher-card-title">Upload / Link Material</h3>

//             <form className="teacher-form" onSubmit={saveMaterial}>
//               <div className="teacher-form-row">
//                 <label>Title</label>
//                 <input
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
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
//                 <button className="teacher-btn-primary">Save Material</button>
//               </div>
//             </form>
//           </div>

//           {/* MATERIAL LIBRARY */}
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

//       {/* ASSIGN POPUP */}
//       {showPopup && (
//         <div className="ts-overlay" onClick={() => setShowPopup(false)}>
//           <div className="ts-popup" onClick={(e) => e.stopPropagation()}>
//             <h3 className="ts-popup-title">
//               Assign Material — {assignData.materialTitle}
//             </h3>

//             <label>Assign To</label>
//             <select
//               value={assignTarget}
//               onChange={(e) => setAssignTarget(e.target.value)}
//             >
//               <option value="ALL">All Students</option>
//               <option value="ONE">Specific Student</option>
//               <option value="CLASS">Class</option>
//             </select>

//             {assignTarget === "ONE" && (
//               <>
//                 <label>Student ID</label>
//                 <select
//                   value={assignData.studentId}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     const st = students.find((x) => x.id === id);

//                     setAssignData({
//                       ...assignData,
//                       studentId: id,
//                       studentName: st?.name || "",
//                       className: st?.className || "",
//                       subject: st?.subject || "",
//                     });
//                   }}
//                 >
//                   <option value="">Select Student</option>
//                   {students.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.id} — {s.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label>Name</label>
//                 <input value={assignData.studentName} readOnly />
//                 <label>Class</label>
//                 <input value={assignData.className} readOnly />
//               </>
//             )}

//             {assignTarget === "CLASS" && (
//               <>
//                 <label>Select Class</label>
//                 <select
//                   value={assignData.className}
//                   onChange={(e) =>
//                     setAssignData({ ...assignData, className: e.target.value })
//                   }
//                 >
//                   <option value="">Select Class</option>
//                   <option value="8A">8A</option>
//                   <option value="8B">8B</option>
//                   <option value="7A">7A</option>
//                 </select>
//               </>
//             )}

//             <div className="ts-popup-actions">
//               <button
//                 className="ts-btn ts-cancel"
//                 onClick={() => setShowPopup(false)}
//               >
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
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  const [loginDetails, setLoginDetails] = useState({});
  const { showSuccess, showError } = useMessage();

  // Upload fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [file, setFile] = useState(null);

  // Assign Popup
  const [showPopup, setShowPopup] = useState(false);
  const [assignTarget, setAssignTarget] = useState("ALL");
  const [selectedId, setSelectedId] = useState("");
  const [studentInfo, setStudentInfo] = useState({});

  const [assignData, setAssignData] = useState({
    materialKey: "",
    materialTitle: "",
  });

  // Load login + students on mount
  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));
    setLoginDetails(login);

    loadStudents();
  }, []);

  // -------------------------------
  // LOAD STUDENTS
  // -------------------------------
  const loadStudents = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/studentData");
      setStudents(res.data || []);
    } catch (e) {
      setStudents([]);
    }
  };

  // -------------------------------
  // UPLOAD MATERIAL
  // -------------------------------
  const saveMaterial = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      showError("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("teacherid", loginDetails.loginId)

    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/upload", formData);

      const materialKey = res.data.key;

      // Add to Material Library (UI only)
      setMaterials((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: title,
          type: type,
          key: materialKey
        },
      ]);

      showSuccess("Material uploaded successfully!");
      setTitle("");
      setType("PDF");
      setFile(null);

    } catch (e) {
      console.log(e);
      showSuccess("Upload failed");
    }
  };

  // -------------------------------
  // OPEN ASSIGN POPUP
  // -------------------------------
  const assignMaterial = (material) => {
    setShowPopup(true);
    setAssignTarget("ALL");
    setSelectedId("");

    setAssignData({
      materialKey: material.key,
      materialTitle: material.title,
    });

    setStudentInfo({});
  };

  // -------------------------------
  // FETCH STUDENT NAME WHEN ID SELECTED
  // -------------------------------
  const handleStudentChange = async (id) => {
    setSelectedId(id);

    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+`/api/roles/student/${id}`);
      setStudentInfo(res.data || {});
    } catch {
      setStudentInfo({});
    }
  };

  // -------------------------------
  // SUBMIT ASSIGN API
  // -------------------------------
  const submitAssign = async () => {

    const payload = {
      materialKey: assignData.materialKey,
      title: assignData.materialTitle,
      type: type,
      teacherId: loginDetails.loginId,
      assignType: assignTarget, // ALL / ONE / CLASS
      studentId: selectedId || null,
      className: loginDetails.className || "XI",
    };

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/content/assign", payload);
      showSuccess("Material assigned successfully!");
      setShowPopup(false);
    } catch (e) {
      console.log(e);
      showError("Assign failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="teacher-layout">
        <Sidebar />

        <div className="teacher-main">
          <h2 className="teacher-page-title">Learning Materials</h2>

          {/* ---------- UPLOAD SECTION ----------- */}
          <div className="teacher-card">
            <h3 className="teacher-card-title">Upload / Link Material</h3>

            <form className="teacher-form" onSubmit={saveMaterial}>
              <div className="teacher-form-row">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="teacher-form-row">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                </select>
              </div>

              <div className="teacher-form-row">
                <label>File Upload</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              </div>

              <div className="teacher-form-actions">
                <button className="teacherSaveMaterials">Save Material</button>
              </div>
            </form>
          </div>

          {/* ---------- MATERIAL LIBRARY ----------- */}
          <div className="teacher-card">
            <h3 className="teacher-card-title">Material Library</h3>

            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>View</th>
                  <th>Assign</th>
                </tr>
              </thead>

              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.type}</td>
                    <td>
                      <a
                        href={import.meta.env.VITE_API_BASE_URL+`/api/content/stream?key=${m.key}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    </td>
                    <td>
                      <button
                        className="ts-assign-btn"
                        onClick={() => assignMaterial(m)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------- ASSIGN POPUP ---------- */}
      {showPopup && (
        <div className="ts-overlay" onClick={() => setShowPopup(false)}>
          <div className="ts-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="ts-popup-title">
              Assign Material — {assignData.materialTitle}
            </h3>

            <label>Assign To</label>
            <select value={assignTarget} onChange={(e) => setAssignTarget(e.target.value)}>
              <option value="ALL">All Students</option>
              <option value="ONE">Specific Student</option>
              <option value="CLASS">Class</option>
            </select>

            {assignTarget === "ONE" && (
              <>
                <label>Select Student</label>
                <select value={selectedId} onChange={(e) => handleStudentChange(e.target.value)}>
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.loginid} value={s.loginid}>
                      {s.loginid} — {s.fullName}
                    </option>
                  ))}
                </select>

                <label>Name</label>
                <input value={studentInfo.fullName || ""} readOnly />

                <label>Class</label>
                <input value={studentInfo.className || ""} readOnly />
              </>
            )}

            <div className="ts-popup-actions">
              <button className="ts-btn ts-cancel" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="ts-btn ts-submit" onClick={submitAssign}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

