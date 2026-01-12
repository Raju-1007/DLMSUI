// src/pages/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext";
import axios from "axios";

export default function AdminProfile() {
   const { showSuccess, showError } = useMessage();
   
    const[adminData,setAdminData]=useState(null);
    const login=useSelector((state)=>state.auth.user)


useEffect(() => {
  if (login?.loginId) {
    getInstructorDetails();
  }
}, [login?.loginId]);

  const getInstructorDetails = async () => {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL +
        "/api/roles/getAdminData"
    );
     let getAdminData = res.data.filter((prev) => prev.loginid === login?.loginId && prev.role ==login?.role) || [];
    
    setAdminData( getAdminData[0] || []);
    
  } catch (err) {
    showError(err?.message || "Failed to load instructor details");
    setAdminData([]);
  }
};


 
  // MOCK DATA (replace with API later)
  const admin = adminData?{
    name: adminData?.fullName,
    adminId: adminData?.loginid,
    role: adminData?.role,
    department: "Academic Administration",
    email: adminData?.email,
    phone: adminData?.mobile,
    status:"Activated"
    
  }:null;
  console.log(admin,"teacherIdsteacherIdsteacherIds");

  return (
    <div>
      <Navbar />

      <div className="sp-layout">
        <Sidebar />

        <div className="sp-main">

          {/* ================= ADMIN PROFILE CARD ================= */}
          <div className="sp-card">
            <div className="sp-profile">
              <div>
                <h3>Admin Profile</h3>
                <p><b>Name:</b> {admin?.name}</p>
                <p><b>Admin Id:</b> {admin?.adminId}</p>
                <p><b>Role:</b> {admin?.role}</p>
                <p><b>Department:</b> {admin?.department}</p>
                <p><b>Email:</b> {admin?.email}</p>
                <p><b>Phone:</b> {admin?.phone}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span className="green">{admin?.status}</span>
                </p>
              </div>

              <div className="sp-rating">
                <div className="sp-image">Image</div>
                <p>Admin Rating</p>
                <span>4.7 ⭐</span>
              </div>
            </div>
          </div>

          {/* ================= ACADEMIC MANAGEMENT SUMMARY ================= */}
          <div className="sp-card">
            <h4>Academic Management Summary</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Handled</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Total Students Managed</td><td>850</td></tr>
                <tr><td>Total Teachers Coordinated</td><td>55</td></tr>
                <tr><td>Classes Assigned</td><td>28</td></tr>
                <tr><td>Subjects Managed</td><td>45</td></tr>
              </tbody>
            </table>
          </div>

          {/* ================= ATTENDANCE & PERFORMANCE ================= */}
          <div className="sp-card">
            <h4>Attendance & Performance Overview</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average Student Attendance</td>
                  <td className="green">89%</td>
                </tr>
                <tr>
                  <td>Students Needing Attention</td>
                  <td className="yellow">12%</td>
                </tr>
                <tr>
                  <td>Overall Pass Percentage</td>
                  <td className="green">91%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ================= ADMIN ACTIVITY SUMMARY ================= */}
          <div className="sp-card">
            <h4>Admin Activity Summary</h4>
            <ul className="sp-list">
              <li>✔ Students Approved: 320</li>
              <li>✔ Teachers Assigned to Classes: 45</li>
              <li>✔ Courses Approved: 60</li>
              <li>✔ Reports Generated: 25</li>
            </ul>
          </div>

          {/* ================= RECENT ADMIN ACTIONS ================= */}
          <div className="sp-card">
            <h4>Recent Admin Actions</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20 Dec</td>
                  <td>Student Approved</td>
                  <td>New student account approved</td>
                </tr>
                <tr>
                  <td>18 Dec</td>
                  <td>Teacher Assigned</td>
                  <td>Maths teacher assigned to 10th A</td>
                </tr>
                <tr>
                  <td>17 Dec</td>
                  <td>Report Generated</td>
                  <td>Monthly attendance report</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
