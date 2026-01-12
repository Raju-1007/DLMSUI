import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useMessage } from "../context/MessageContext"; 


export default function SuperAdminApproval() {
  const { showSuccess, showError } = useMessage();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/roles/pendingUsers");
      setUsers(res.data);
    
    } catch(err) {
       showError("Error loading pending users", err);
    }
  };

  const approveUser = async (id) => {
    await axios.put(import.meta.env.VITE_API_BASE_URL+`/api/roles/approve/${id}`);
    loadPendingUsers();
  };

  const rejectUser = async (id) => {
    await axios.put(import.meta.env.VITE_API_BASE_URL+`/api/roles/reject/${id}`);
    loadPendingUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(import.meta.env.VITE_API_BASE_URL+`/api/roles/delete/${id}`);
    loadPendingUsers();
  };

  return (
    <div className="dashboard-layout">

      {/* FIXED NAVBAR */}
      <Navbar />

      <div className="dashboard-body">
        {/* FIXED SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <div className="approval-content">

          <h2 className="title">User Approval Panel</h2>

          <div className="table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No pending users</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.loginId}>
                      <td>{u.loginid}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`status-badge ${u.status.toLowerCase()}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-approve" onClick={() => approveUser(u.loginid)}>Approve</button>
                        <button className="btn-reject" onClick={() => rejectUser(u.loginid)}>Reject</button>
                        <button className="btn-delete" onClick={() => deleteUser(u.loginid)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
