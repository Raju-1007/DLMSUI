// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import axios from 'axios';

// export default function CourseList() {
//   const [courses, setCourses] = useState([]);
//   const [showDialog, setShowDialog] = useState(false);
//   const [courseName, setCourseName] = useState('');

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+'/api/courses/getCourses');
      
//       setCourses(res.data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };


//   const handleAddClick = () => {
//     setShowDialog(true);
//   };

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!courseName.trim()) return showError('Please enter a course name');
//     try {
//       await axios.post(import.meta.env.VITE_API_BASE_URL+'/api/courses/addCourses', { 
//         title: courseName });
//       setCourseName('');
//       setShowDialog(false);
//       fetchCourses(); 
//     } catch (error) {
//       console.error('Error adding course:', error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
//         <Sidebar />
//         <div style={{ padding: 16 }}>
//           <h2>Courses</h2>

//           {/* ✅ Add Button */}
//           <button
//             type="button"
//             style={{
//               padding: 10,
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: 5,
//               cursor: 'pointer',
//               marginBottom: 20
//             }}
//             onClick={handleAddClick}
//           >
//             + Add Course
//           </button>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: 12
//           }}>
//             {courses.map(c => (
//               <a
//                 key={c.id}
//                 href={`/course/${c.id}`}
//                 className='card'
//                 style={{
//                   textDecoration: 'none',
//                   color: '#111',
//                   border: '1px solid #ccc',
//                   padding: 12,
//                   borderRadius: 8
//                 }}
//               >
//                 <b>{c.title}</b>
//                 <div>View chapters</div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>

    
//       {showDialog && (
//         <div style={{
//           position: 'fixed',
//           top: 0, left: 0, right: 0, bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: 20,
//             borderRadius: 10,
//             width: 320
//           }}>
//             <h3>Add New Course</h3>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 placeholder="Enter course name"
//                 value={courseName}
//                 onChange={(e) => setCourseName(e.target.value)}
//                 style={{
//                   width: '100%',
//                   padding: 8,
//                   marginBottom: 12,
//                   border: '1px solid #ccc',
//                   borderRadius: 4
//                 }}
//               />
//               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
//                 <button type="submit" style={{
//                   padding: '8px 14px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 5,
//                   cursor: 'pointer'
//                 }}>Save</button>
//                 <button type="button" onClick={() => setShowDialog(false)} style={{
//                   padding: '8px 14px',
//                   backgroundColor: '#dc3545',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 5,
//                   cursor: 'pointer'
//                 }}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// // import React, { useState, useEffect } from 'react';
// // import Navbar from '../components/Navbar';
// // import Sidebar from '../components/Sidebar';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// // export default function CourseList() {
// //   const [courses, setCourses] = useState([]);
// //   const [showDialog, setShowDialog] = useState(false);
// //   const [courseName, setCourseName] = useState('');
// //   const nav = useNavigate();

// //   useEffect(() => {
// //     fetchCourses();
// //   }, []);

// //   const fetchCourses = async () => {
// //     try {
// //       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+'/api/courses/getCourses');
// //       setCourses(res.data);
// //     } catch (error) {
// //       console.error('Error fetching courses:', error);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!courseName.trim()) return showSuccess("Enter course name");

// //     try {
// //       await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/courses/addCourses", {
// //         title: courseName
// //       });

// //       setCourseName('');
// //       setShowDialog(false);
// //       fetchCourses();

// //     } catch (e) {
// //       console.error(e);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Navbar />

// //       <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
// //         <Sidebar />

// //         <div className="course-container">

// //           <div className="course-header">
// //             <h2>📚 Courses</h2>
// //             <button className="add-btn" onClick={() => setShowDialog(true)}>
// //               + Add Course
// //             </button>
// //           </div>

// //           <div className="course-list">
// //             {courses.map(c => (
// //               <div 
// //                 key={c.id} 
// //                 className="course-card"
// //                 onClick={() => nav(`/chapters/${c.id}`)}
// //               >
// //                 <div className="course-title">{c.title}</div>
// //                 <div className="course-sub">Click to manage chapters ➜</div>
// //               </div>
// //             ))}
// //           </div>

// //         </div>
// //       </div>

// //       {/* 🔥 Beautiful Dialog */}
// //       {showDialog && (
// //         <div className="modal-bg">
// //           <div className="modal-box">
// //             <h3>Add New Course</h3>

// //             <form onSubmit={handleSubmit}>
// //               <input 
// //                 type="text"
// //                 placeholder="Enter course name"
// //                 value={courseName}
// //                 onChange={(e) => setCourseName(e.target.value)}
// //                 className="modal-input"
// //               />

// //               <div className="modal-actions">
// //                 <button className="save-btn">Save</button>
// //                 <button 
// //                   className="cancel-btn" 
// //                   type="button"
// //                   onClick={() => setShowDialog(false)}
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>

// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }



import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useMessage } from "../context/MessageContext"; 
export default function CourseList() {
  const { showSuccess, showError } = useMessage();

  const [courses, setCourses] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [courseName, setCourseName] = useState("");
  const[className,setClassName]=useState("");
  const[sectionName,setSectionName]=useState("");
  const navigate=useNavigate();
  const[loginDetails,setLoginDetails]=useState("");
    let login=useSelector((state)=>state.auth.user);
    const[Progress,setProgress]=useState("");

  useEffect(() => {
  let  progress=localStorage.getItem('progress')
  setProgress(progress);
   
   let  courseTitle=localStorage.getItem('courseTitle')
    setLoginDetails(login);
    fetchCourses();
  }, []);

  const loginId=loginDetails.loginId;

  const fetchCourses = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/courses/getCourses");
      localStorage.setItem("CourseData",JSON.stringify(res.data));
      setCourses(res.data);
    } catch (error) {
     showError("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return showSuccess("Enter course name");
    const payload={
         studentId:loginId,
        title: courseName,
        className:className,
        sectionName:sectionName
    }
    console.log(payload);

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/courses/addCourses", payload);

      setCourseName("");
      setShowDialog(false);
      fetchCourses();

    } catch (e) {
      console.error(e);
    }
  };
  // const navigateChapterview=()=>{
  //    navigate('/chapterviews')
  // }

  const navigateChapterview = (id, title) => {
  navigate(`/chapterviews/${id}/${encodeURIComponent(title)}`);
};

  // ⭐ Get progress bar color
  const getColor = (percent) => {
    if (percent >= 75) return "#2ecc71"; // green
    if (percent >= 45) return "#ffa500"; // orange
    return "#e74c3c"; // red
  };

 

  return (
    <div>
      <Navbar />

      <div className="course-layout">
        <Sidebar />

        <div className="course-right">

          {/* TITLE + ADD BUTTON */}
          <div className="title-row">
            <h2 className="course-title">Courses</h2>

            <button className="add-course-btn" onClick={() => setShowDialog(true)}>
              + Add Course
            </button>
          </div>

          {/* COURSE CARDS */}
          <div className="course-grid">
            {courses.map((c) => {
              // const percentage = c.percentage || 0;
              const percentage = Progress || 0;
              const color = getColor(percentage);

              return (
                <div className="course-card" key={c.id}>

                  <h3 className="course-name">{c.title}</h3>

                  <div className="progress-wrapper">
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      styles={buildStyles({
                        pathColor: color,
                        textColor: "#333",
                        trailColor: "#eee",
                        strokeLinecap: "round",
                        textSize: "24px",
                      })}
                    />
                  </div>

                  {/* <button className="details-btn" onClick={navigateChapterview}>View Details</button> */}
                  <button
                    className="details-btn"
                    onClick={() => navigateChapterview(c.id, c.title)}
                  >
                    View Details
                  </button>

                </div>
              );
            })}
          </div>

          {/* MODAL POPUP */}
          {showDialog && (
            <div className="modal-bg">
              <div className="modal-box">
                <h3>Add Course and Class Details</h3>

                <form onSubmit={handleSubmit}>
                   <input
                    type="text"
                    placeholder="Enter Your Id"
                    value={loginId}
                    className="modal-input"
                  />

                   <label>Enter className<span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="modal-input"
                  />
                  <label>Enter sectionName<span className="req">*</span></label>
                   <input
                    type="text"
                    placeholder="Enter Section name"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="modal-input"
                  />
                  <label>Enter courseName<span className="req">*</span></label>
                   <input
                    type="text"
                    placeholder="Enter course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="modal-input"
                  />

                  {/* <div className="modal-actions">
                    <button className="save-btn" type="submit">Save</button>
                    <button
                      className="cancel-btnn"
                      type="button"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </button>
                  </div> */}
                  <div style={{display:'flex',flexDirection:'row', marginTop:'10px',justifyContent:'space-around'}}>
                     <button  className="cancel-btnnnnnnnn" onClick={() => setShowDialog(false)}>Cancel</button>
                      <button className="save-btn" type="submit" >Save</button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
