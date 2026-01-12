// src/pages/SuperAdminProfile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

export default function SuperAdminProfile() {

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
  const superAdmin= adminData?{
    name: adminData?.fullName,
    adminId: adminData?.loginid,
    role: adminData?.role,
    department: "Academic Administration",
    email: adminData?.email,
    phone: adminData?.mobile,
    status:"Activated"
    
  }:null;

  // MOCK DATA – later connect API
  

  return (
    <div>
      <Navbar />

      <div className="sp-layout">
        <Sidebar />

        <div className="sp-main">

          {/* ================= SUPER ADMIN PROFILE CARD ================= */}
          <div className="sp-card">
            <div className="sp-profile">
              <div>
                <h3>Super Admin Profile</h3>
                <p><b>Name:</b> {superAdmin?.name}</p>
                <p><b>Super Admin Id:</b> {superAdmin?.superAdminId}</p>
                <p><b>Role:</b> {superAdmin?.role}</p>
                <p><b>Organization:</b> {superAdmin?.organization}</p>
                <p><b>Email:</b> {superAdmin?.email}</p>
                <p><b>Phone:</b> {superAdmin?.phone}</p>
                <p><b>Last Login:</b> {superAdmin?.lastLogin}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span className="green">{superAdmin?.status}</span>
                </p>
              </div>

              <div className="sp-rating">
                <div className="sp-image">Image</div>
                <p>Authority Level</p>
                <span>Full Access 🔑</span>
              </div>
            </div>
          </div>

          {/* ================= PLATFORM OVERVIEW ================= */}
          <div className="sp-card">
            <h4>Platform Overview</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Total Count</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Organizations / Schools</td><td>5</td></tr>
                <tr><td>Admins</td><td>12</td></tr>
                <tr><td>Teachers</td><td>120</td></tr>
                <tr><td>Students</td><td>5,200</td></tr>
                <tr><td>Courses</td><td>320</td></tr>
              </tbody>
            </table>
          </div>

          {/* ================= ROLE & PERMISSION CONTROL ================= */}
          <div className="sp-card">
            <h4>Role & Permission Control</h4>
            <ul className="sp-list">
              <li>✔ Create / Disable Admin Accounts</li>
              <li>✔ Assign Roles & Permissions</li>
              <li>✔ Control Multi-Organization Access</li>
              <li>✔ Approve Platform-Level Features</li>
              <li>✔ Audit Logs & Security Policies</li>
            </ul>
          </div>

          {/* ================= SYSTEM & SECURITY ================= */}
          <div className="sp-card">
            <h4>System & Security Overview</h4>
            <ul className="sp-list">
              <li>🔐 Authentication: Secure</li>
              <li>🛡 Authorization: Role-based</li>
              <li>📦 Storage Usage: 68%</li>
              <li>🔁 Backups: Automated & Verified</li>
            </ul>
          </div>

          {/* ================= SUPER ADMIN ACTIVITY ================= */}
          <div className="sp-card">
            <h4>Super Admin Activity Log</h4>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>21 Dec</td>
                  <td>Admin Created</td>
                  <td>New admin added for School A</td>
                </tr>
                <tr>
                  <td>19 Dec</td>
                  <td>Permission Updated</td>
                  <td>Role permissions modified</td>
                </tr>
                <tr>
                  <td>18 Dec</td>
                  <td>Organization Added</td>
                  <td>New school onboarded</td>
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
