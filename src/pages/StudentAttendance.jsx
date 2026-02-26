import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext";

export default function StudentAttendance() {

  const { showError } = useMessage();
  const loginDetails = useSelector((state) => state.auth.user);

  const [attendance, setattendance] = useState([]);
  const [search, setSearch] = useState("");
  const [loginStuDeatils, setLoginStuDetails] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loginstuDetails = JSON.parse(
      localStorage.getItem("studentsInformation")
    );

    setLoginStuDetails(loginstuDetails || {});
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/getAtendanceDetails`,
        {
          params: {
            studentId: loginDetails?.userDetails?.loginid,
          },
        }
      );

      setattendance(res.data || []);
    } catch (error) {
      showError("Error fetching attendance");
    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredAttendance = attendance.filter((item) =>
    item.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div>
      <Navbar />

      <div className="assign-layout">
        <Sidebar />

        <div className="assign-content">
          <h2 className="assign-title">Attendance</h2>

          <div className="assign-table-card">

            {/* Date Filter */}
            {/* <div>
              <label className="ta-label">Date</label>
              <input
                type="date"
                className="ta-date-inputt"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div> */}

            {/* Header Row */}
            <div className="assign-top-row">
              <h3 className="student-name">
                {loginStuDeatils?.fullName} - {loginStuDeatils?.loginid}
              </h3>

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

            {/* Attendance Table */}
            <table className="assign-table">
              <thead>
                <tr>
                  <th>S_ID</th>
                  <th>S_NAME</th>
                  <th>SUBJECT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((a, i) => (
                    <tr key={i}>
                      <td>{a.studentId}</td>
                      <td>{a.studentName}</td>
                      <td>{a.subjectName}</td>

                    

                      <td>{a.date}</td>

                      <td>
                        {a.attendance === "Active" ? (
                          <span className="badge completed">
                            Active
                          </span>
                        ) : (
                          <span className="badge progress">
                            {a.attendance}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No attendance records found
                    </td>
                  </tr>
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
