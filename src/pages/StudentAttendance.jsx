import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext"; 


export default function StudentAttendance() {
  const { showSuccess, showError } = useMessage();
  const [attendance, setattendance] = useState([]);
   const loginDetails = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const[loginStuDeatils,setLoginStuDetails]=useState("");
  const [date, setDate] = useState(
      new Date().toISOString().slice(0, 10)
    );

  // Hardcoded fallback
  
  useEffect(() => {
    let loginstuDetails=JSON.parse(localStorage.getItem('studentsInformation'));
     setLoginStuDetails(loginstuDetails);
    loadAssignments();
  }, [date]);

  const loadAssignments = async () => {

    console.log(loginDetails.loginId);
    
    try {
       const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/attendances/attendance/getStudentLoginId",
  {
    params: {
      date: date,
      studentId: loginDetails.loginId   // 👈 MUST BE SENT
    }
  }
);
console.log(res,"===========================>===========================")

    
      if (res.data && res.data.length > 0) {
        setattendance(res.data);
      } else {
           setattendance([]);
      }
    } catch(err) {
       showError("API failed → Loading fallback", err);

    }
  };

  // const filtered = assignments.filter((a) =>
  //   a.subject?.toLowerCase().includes(search.toLowerCase())
  // );
  //  console.log(filtered,"filtered================================>");

  return (
    <div>
      <Navbar />

      <div className="assign-layout">
        <Sidebar />

        <div className="assign-content">
          <h2 className="assign-title">Attendance</h2>

          <div className="assign-table-card">
             <div  className>
                <label className="ta-label">Date</label>
                <input
                  type="date"
                  className="ta-date-inputt"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}

                />
              </div>

            {/* Header Row */}
            <div className="assign-top-row">
              <h3 className="student-name">{loginStuDeatils.fullName}-{loginStuDeatils.loginid}</h3>
                <div className="ta-header">

             

            </div>

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
                  <th>SECTION</th>
                  <th>MARK</th>
                  {/* <th>GRADE</th> */}
                  {/* <th>REPORTS</th> */}
                 
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.studentId}</td>
                    <td>{a.name}</td>
                    <td>{a.subject}</td>

                    <td>{a.className}</td>
                    <td>{a.section}</td>
                    <td>{a.mark}</td>
                    <td>{a.date}</td>
                    

                

                    <td>
                      {a.status === "Late" && (
                        <span className="badge completed">late</span>
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
