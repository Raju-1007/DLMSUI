import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";

export default function TeacherLoginActivity() {

  const login = useSelector((state) => state.auth.user);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchLoginActivities();
  }, []);

  const fetchLoginActivities = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/roles/getLoginActivityData`
    );

    const filteredData = (res.data || []).filter(
      (item) =>
        item.role === "STUDENT" || item.role === "TEACHER"
    );

    setActivities(filteredData);

  } catch (err) {
    console.error(err);
  }
};


  /* ================= CALCULATE LOGIN HOURS ================= */
  const calculateDuration = (loginDate, logoutDate) => {
    if (!logoutDate) return "Active";

    const start = new Date(loginDate);
    const end = new Date(logoutDate);
    const diffMs = end - start;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Navbar />

      <div className="sp-layout">
        <Sidebar />

        <div className="sp-main">

          <div className="sp-card">
            <h3>Teacher Login Activity</h3>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>email</th>
                   <th>adhaarNumber</th>
                  <th>Role</th>
                  <th>Login Date</th>
                  <th>Logout Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {activities.length > 0 ? (
                  activities.map((a) => (
                    <tr key={a.id}>
                      <td>{a.name}</td>
                      <td>{a.email}</td>
                      <td>{a.adhaar}</td>
                      <td>{a.role}</td>
                      <td>{a.loginTime}</td>
                      <td>{a.logoutTime || "-"}</td>
                      <td>{calculateDuration(a.loginTime, a.logoutTime)}</td>
                      <td>
                        {a.logoutDate ? (
                          <span className="green">Logged Out</span>
                        ) : (
                          <span className="blue">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No Login Activity Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
