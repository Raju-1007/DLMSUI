
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
