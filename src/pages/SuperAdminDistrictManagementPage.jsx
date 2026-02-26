import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";

export default function SuperAdminDistrictManagementPage() {
  const { showError, showSuccess } = useMessage();

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const login=useSelector((state)=>state.auth.user);
  useEffect(() => {
    loadDistricts();
  }, []);

  // ================= LOAD DISTRICTS =================
  const loadDistricts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/districtsWiseCount`
      );

      if (Array.isArray(res.data)) {
        setDistricts(res.data);
      } else {
        setDistricts([]);
      }
    } catch (err) {
      showError("Failed to load district data");
      setDistricts([]);
    }
    setLoading(false);
  };

  // ================= GET ADMIN BY DISTRICT =================
  const handleAssignToAdmin = async (district) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/getAdminDetailsByDitrictId/${district.district_id}`
      );

      if (res.data && res.data.length > 0) {
        setSelectedAdmin({
          ...res.data[0],
          district_id: district.district_id
        });
        setShowPopup(true);
      } else {
        showError("No Admin found for this district");
      }
    } catch (err) {
      showError("Failed to load Admin Details based on DistrictId");
    }
  };

  // ================= ASSIGN ADMIN =================
  const handleAssign = async (admin) => {
    const payLoad = {
      superAdminId:login?.userDetails?.loginid,
      superAdminName:login?.userDetails?.fullName,
      adminName: admin.teacher_name,
      adminEmail: admin.teacher_email,
      adminPhone: admin.teacher_phone,
      adminRole: admin.role,
      districtId: admin.district_id
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/api/grades/addAssignToAdmin`,
        payLoad
      );

      showSuccess("Admin assigned successfully");
      setShowPopup(false);
    } catch (err) {
      showError("Unable to assign to Admin");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="layout-grid">
          <Sidebar />
          <main className="admin-main">
            <div className="loading">Loading districts...</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div>
      <Navbar />

      <div className="layout-grid">
        <Sidebar />

        <main className="admin-main">
          <h2 className="admin-title">Super Admin Management</h2>

          <section className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>District Name</th>
                  <th>State</th>
                  <th>Mandals</th>
                  <th>Villages</th>
                  <th>Schools</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {districts.length > 0 ? (
                  districts.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td>AP</td>
                      <td>{d.mandal_count}</td>
                      <td>{d.village_count}</td>
                      <td>{d.school_count}</td>
                      <td>{d.student_count}</td>

                      <td>
                        <button
                          className="btn-assign"
                          onClick={() => handleAssignToAdmin(d)}
                        >
                          Assign Admin
                        </button>

                        <button className="btn-delete">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No District Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>

        {/* ================= POPUP ================= */}
        {showPopup && selectedAdmin && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Assign District Admin</h3>

              <p><strong>Name:</strong> {selectedAdmin.teacher_name}</p>
              <p><strong>Email:</strong> {selectedAdmin.teacher_email}</p>
              <p><strong>Phone:</strong> {selectedAdmin.teacher_phone}</p>
              <p><strong>Role:</strong> {selectedAdmin.role}</p>

              <div className="modal-actions">
                <button
                  className="btn-save"
                  onClick={() => handleAssign(selectedAdmin)}
                >
                  Assign
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
