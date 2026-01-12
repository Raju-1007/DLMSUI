// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const Assignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const studentName = "raju"; // replace with logged-in student name or ID

//   useEffect(() => {
//     fetchAssignments();
//   }, []);

//   // Fetch assignments
//   const fetchAssignments = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/assessments/getassignment");
//       setAssignments(res.data || []);
//     } catch (error) {
//      showError("Error fetching assignments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark assignment as complete
//   const markComplete = async (id) => {
//     try {
//       await axios.put(import.meta.env.VITE_API_BASE_URL+`/api/assignments/${id}/complete`);
//       showSuccess("✅ Assignment marked as completed!");
//       fetchAssignments(); // reload
//     } catch (error) {
//      showError("Error completing assignment:", error);
//       showSuccess("❌ Failed to update status.");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
//         <Sidebar />

//         <div style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
//           {/* Title */}
//           <h2
//             style={{
//               fontSize: 24,
//               fontWeight: 700,
//               color: "#1e293b",
//               marginBottom: 16,
//               borderBottom: "2px solid #e2e8f0",
//               paddingBottom: 6,
//             }}
//           >
//             📝 My Assignments
//           </h2>

//           {/* Loader */}
//           {loading ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 marginTop: 100,
//                 fontSize: 18,
//                 color: "#475569",
//               }}
//             >
//               ⏳ Loading assignments...
//             </div>
//           ) : assignments.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 marginTop: 80,
//                 color: "#64748b",
//                 fontSize: 16,
//               }}
//             >
//               📭 No assignments assigned yet.
//             </div>
//           ) : (
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: 10,
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
//                 overflow: "hidden",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 15,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ background: "#f8fafc" }}>
//                     <th style={thStyle}>Title</th>
//                     <th style={thStyle}>Description</th>
//                     <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
//                     <th style={{ ...thStyle, textAlign: "center" }}>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {assignments.map((a, i) => (
//                     <tr
//                       key={i}
//                       style={{
//                         backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
//                         transition: "background 0.3s ease",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#eef2ff")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor =
//                           i % 2 === 0 ? "#ffffff" : "#f9fafb")
//                       }
//                     >
//                       <td style={tdStyle}>{a.title || "Untitled"}</td>
//                       <td style={tdStyle}>{a.description || "No description"}</td>
//                       <td style={{ ...tdStyle, textAlign: "center" }}>
//                         {a.completed ? (
//                           <span style={statusBadge("green")}>✅ Completed</span>
//                         ) : (
//                           <span style={statusBadge("orange")}>⏳ Pending</span>
//                         )}
//                       </td>
//                       <td style={{ ...tdStyle, textAlign: "center" }}>
//                         {!a.completed && (
//                           <button
//                             onClick={() => markComplete(a.id)}
//                             style={completeButton}
//                           >
//                             Mark Complete
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Common table header style
// const thStyle = {
//   padding: "12px 10px",
//   fontWeight: 600,
//   color: "#334155",
//   borderBottom: "2px solid #e2e8f0",
//   textAlign: "left",
// };

// // Common cell style
// const tdStyle = {
//   padding: "12px 10px",
//   borderBottom: "1px solid #e5e7eb",
//   color: "#475569",
// };

// // Button style
// const completeButton = {
//   backgroundColor: "#00b86b",
//   color: "white",
//   border: "none",
//   padding: "6px 12px",
//   borderRadius: 6,
//   cursor: "pointer",
//   transition: "background 0.3s ease",
// };

// // Status badge helper
// const statusBadge = (color) => ({
//   padding: "4px 10px",
//   borderRadius: "12px",
//   fontSize: "13px",
//   fontWeight: 600,
//   color: color === "green" ? "#15803d" : "#b45309",
//   backgroundColor: color === "green" ? "#dcfce7" : "#fef3c7",
// });

// export default Assignments;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// export default function Assignments() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAssignments();
//   }, []);

//   const fetchAssignments = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/assessments/getassignment");
//       setAssignments(res.data || []);
//     } catch (error) {
//      showError("Error fetching assignments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markComplete = async (id) => {
//     try {
//       await axios.put(import.meta.env.VITE_API_BASE_URL+`/api/assignments/${id}/complete`);
//       fetchAssignments();
//     } catch (error) {
//       showSuccess("Error updating status");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="page-layout">
//         <Sidebar />

//         <div className="assignment-wrapper">
//           {/* HEADER */}
//           <div className="assignment-header">
//             <h2>📘 My Assignments</h2>
//             <div className="line"></div>
//           </div>

//           {/* LOADING */}
//           {loading ? (
//             <div className="loading">⏳ Loading Assignments...</div>
//           ) : assignments.length === 0 ? (
//             <div className="empty">📭 No Assignments Found</div>
//           ) : (
//             <div className="tree-container">

//               {/* 🔥 TREE STRUCTURE */}
//               <div className="tree-box">
//                 <h3 className="tree-title">📂 Assigned Work</h3>

//                 <ul className="tree">
//                   {assignments.map((a, index) => (
//                     <li key={a.id} className="tree-item">
//                       <span className="tree-label">
//                         📄 {a.title}
//                       </span>

//                       <div className="tree-details">
//                         <p>{a.description}</p>

//                         {/* STATUS */}
//                         {a.completed ? (
//                           <span className="badge done">Completed</span>
//                         ) : (
//                           <span className="badge pending">Pending</span>
//                         )}

//                         {/* ACTION */}
//                         {!a.completed && (
//                           <button
//                             className="btn-complete"
//                             onClick={() => markComplete(a.id)}
//                           >
//                             Mark Complete
//                           </button>
//                         )}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/Assignments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext"; 
export default function Assignments() {

  const { showSuccess, showError } = useMessage();

  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const loginDetails = useSelector((state) => state.auth.user);
  const[average,setAverage]=useState("");
  const[LoginStuDetails,setLoginStuDetails]=useState("");
      
      
      
      const studentId = Number(loginDetails.loginId);

  // Hardcoded fallback
  const fallback = [
    {
      id: 1,
      subject: "Mathematics",
      date: "20/5/2025",
      grade: "B+",
      percentage: 100,
      status: "Completed",
    },
    {
      id: 2,
      subject: "Science",
      date: "18/11/2025",
      grade: "A",
      percentage: 90,
      status: "In-progress",
    },
    {
      id: 3,
      subject: "Social",
      date: "22/12/2025",
      grade: "A+",
      percentage: 0,
      status: "Upcoming",
    },
    {
      id: 4,
      subject: "Hindi",
      date: "12/10/2025",
      grade: "C",
      percentage: 100,
      status: "Completed",
    },
  ];
  
  useEffect(() => {
    let loginstuDetails=JSON.parse(localStorage.getItem('studentsInformation'));
     setLoginStuDetails(loginstuDetails);
    let  progress=localStorage.getItem('progress')
   setAverage(progress);
    loadAssignments();
  }, []);
   

//  const loadAssignments = async () => {
//   try {
//     const res = await axios.get(
//       import.meta.env.VITE_API_BASE_URL+"/api/assessments/getassignment"
//     );
//     const data = Array.isArray(res.data)
//       ? res.data
//       : res.data?.data || [];   // 👈 IMPORTANT
      

//     setAssignments(data.length > 0 ? data : fallback);

//   } catch(err) {
//    showError("API failed → Loading fallback", err);
//     setAssignments(fallback);
//   }
// };

const loadAssignments = async () => {
  try{
  const res = await axios.get(
  import.meta.env.VITE_API_BASE_URL+"/api/assessments/getassignment",
  {
    params: { studentId }   // 👈 THIS IS IMPORTANT
  });
  const data = Array.isArray(res.data)
     ? res.data
      : res.data?.data || []

 setAssignments(data.length > 0 ? data : fallback);
}
catch(err) {
  showError("API failed → Loading fallback", err);
    setAssignments(fallback);
  }
};










  // const filtered = assignments.filter((a) =>
  //   a.subject?.toLowerCase().includes(search.toLowerCase())
  //  );
   

  return (
    <div  className="assign-layoutt">
      <Navbar />

      <div className="assign-layout">
        <Sidebar />

        <div className="assign-content">
          <h2 className="assign-title">Assignments</h2>

          <div className="assign-table-card">
            {/* Header Row */}
            <div className="assign-top-row">
              <h3 className="student-name">{LoginStuDetails.fullName} · {LoginStuDetails.loginid}</h3>

              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search course"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <table className="assign-table">
              <thead>
                <tr>
                  <th>S_ID</th>
                  <th>S_NAME</th>
                  <th>SUBJECT</th>
                  <th>CLASS</th>
                  <th>ASSIGNMENT</th>
                  <th>DUE DATE</th>
                  {/* <th>GRADE</th> */}
                  {/* <th>REPORTS</th> */}
                  <th>COURSE COMPLETED (%)</th>
                  <th>MAXMarks</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((a, i) => (
                  <tr key={i}>
                    <td>{a.id}</td>
                    <td>{a.studentName}</td>
                    <td>{a.assignmentTitle}</td>

                    <td>{a.assignmentTitle}</td>
                    <td>{a.className}</td>
                    <td>{a.dueDate}</td>
                    {/* <td>{a.grade}</td> */}

                    {/* <td className="report-links">
                      <a href="#">View Report</a> &nbsp;&nbsp;
                      <a href="#" className="blue-link">Download Report</a>
                    </td> */}

                    {/* <td>{a.percentage}</td> */}
                    <td>{average}</td>
                    <td>{a.maxMarks}</td>

                    <td>
                      {a.status === "ASSIGNED" && (
                        <span className="badge completed">Complete assign</span>
                      )}
                      {a.status === "Upcoming" && (
                        <span className="badge upcoming">Upcoming</span>
                      )}
                      {a.status === "In-progress" && (
                        <span className="badge progress">In-progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
