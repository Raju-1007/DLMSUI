

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
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/content/getCourses");
      setCourses(res.data);
    } catch (error) {
     showError("Error fetching courses:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!courseName.trim()) return showSuccess("Enter course name");
  //   const payload={
  //        studentId:loginId,
  //       title: courseName,
  //       className:className,
  //       sectionName:sectionName
  //   }
  //   console.log(payload);

  //   try {
  //     await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/courses/addCourses", payload);

  //     setCourseName("");
  //     setShowDialog(false);
  //     fetchCourses();

  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  // const navigateChapterview=()=>{
  //    navigate('/chapterviews')
  // }

  const navigateChapterview = (subjectId, subjectName) => {
  navigate(`/chapterviews/${subjectId}/${encodeURIComponent(subjectName)}`);
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

            {/* <button className="add-course-btn" onClick={() => setShowDialog(true)}>
              + Add Course
            </button> */}
          </div>

          {/* COURSE CARDS */}
          <div className="course-grid">
            {courses.map((c) => {
              // const percentage = c.percentage || 0;
              const percentage = Progress || 0;
              const color = getColor(percentage);

              return (
                <div className="course-card" key={c.subjectId}>

                  <h3 className="course-name">{c.subjectName}</h3>

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
                    onClick={() => navigateChapterview(c.subjectId, c.subjectName)}
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
