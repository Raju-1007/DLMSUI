import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useMessage } from "../context/MessageContext"; 

export default function SuperAdminDistrictManagementPage() {
  const { showSuccess, showError } = useMessage();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [newDistrict, setNewDistrict] = useState({
    name: "",
    state: "Andhra Pradesh",
    mandals: 0,
  });

  const [editDistrict, setEditDistrict] = useState(null);
  const [assignAdmin, setAssignAdmin] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fallback data if API fails or returns nothing
  const fallback = [
    {
      id: 1,
      name: "Krishna",
      state: "Andhra Pradesh",
      mandals: 25,
      schools: 120,
      students: 34000,
    },
    {
      id: 2,
      name: "Guntur",
      state: "Andhra Pradesh",
      mandals: 22,
      schools: 98,
      students: 28000,
    },
    {
      id: 3,
      name: "Nellore",
      state: "Andhra Pradesh",
      mandals: 18,
      schools: 75,
      students: 22000,
    },
    {
      id: 4,
      name: "Prakasam",
      state: "Andhra Pradesh",
      mandals: 20,
      schools: 60,
      students: 18000,
    },
  ];

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/super-admin/districts");
      console.log("District API:", res?.data);

      let list = [];

      if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data?.districts)) {
        list = res.data.districts;
      } else {
        console.warn("Invalid API format → using fallback");
        list = fallback;
      }

      setDistricts(list);
    } catch(err) {
       showError("District API failed → using fallback:", err);
      setDistricts(fallback);
    }
    setLoading(false);
  };

  const handleAddDistrict = () => {
    const newEntry = {
      id: districts.length + 1,
      ...newDistrict,
      schools: 0,
      students: 0,
    };
    setDistricts([...districts, newEntry]);
    setShowAddModal(false);
    setNewDistrict({ name: "", state: "Andhra Pradesh", mandals: 0 });
  };

  const handleEditDistrict = () => {
    const updated = districts.map((d) =>
      d.id === editDistrict.id ? editDistrict : d
    );
    setDistricts(updated);
    setShowEditModal(false);
  };

  const handleDeleteDistrict = (id) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      setDistricts(districts.filter((d) => d.id !== id));
    }
  };

  const handleAssignAdmin = () => {
    showSuccess("District admin assigned (demo only)");
    setShowAssignModal(false);
    setAssignAdmin({ name: "", email: "", phone: "" });
  };

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

  return (
    <div>
      <Navbar />

      {/* Layout: sidebar + main content */}
      <div className="layout-grid">
        <Sidebar />

        <main className="admin-main">
          <h2 className="admin-title"> System Management</h2>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add System Managment
          </button>

          <section className="table-card">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>District Name</th>
                  <th>State</th>
                  <th>Mandals</th>
                  <th>Schools</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {districts.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.state}</td>
                    <td>{d.mandals}</td>
                    <td>{d.schools}</td>
                    <td>{d.students}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditDistrict(d);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-assign"
                        onClick={() => setShowAssignModal(true)}
                      >
                        Assign Admin
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteDistrict(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Add Modal */}
          {showAddModal && (
            <Modal>
              <h3>Add District</h3>
              <input
                type="text"
                placeholder="District Name"
                value={newDistrict.name}
                onChange={(e) =>
                  setNewDistrict({ ...newDistrict, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                value={newDistrict.state}
                onChange={(e) =>
                  setNewDistrict({ ...newDistrict, state: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Mandals Count"
                value={newDistrict.mandals}
                onChange={(e) =>
                  setNewDistrict({
                    ...newDistrict,
                    mandals: Number(e.target.value),
                  })
                }
              />
              <div className="modal-actions">
                <button className="btn-save" onClick={handleAddDistrict}>
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}

          {/* Edit Modal */}
          {showEditModal && editDistrict && (
            <Modal>
              <h3>Edit District</h3>
              <input
                type="text"
                value={editDistrict.name}
                onChange={(e) =>
                  setEditDistrict({ ...editDistrict, name: e.target.value })
                }
              />
              <input
                type="text"
                value={editDistrict.state}
                onChange={(e) =>
                  setEditDistrict({ ...editDistrict, state: e.target.value })
                }
              />
              <input
                type="number"
                value={editDistrict.mandals}
                onChange={(e) =>
                  setEditDistrict({
                    ...editDistrict,
                    mandals: Number(e.target.value),
                  })
                }
              />
              <div className="modal-actions">
                <button className="btn-save" onClick={handleEditDistrict}>
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}

          {/* Assign Admin Modal */}
          {showAssignModal && (
            <Modal>
              <h3>Assign District Admin</h3>
              <input
                type="text"
                placeholder="Admin Name"
                value={assignAdmin.name}
                onChange={(e) =>
                  setAssignAdmin({ ...assignAdmin, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Admin Email"
                value={assignAdmin.email}
                onChange={(e) =>
                  setAssignAdmin({ ...assignAdmin, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Admin Phone"
                value={assignAdmin.phone}
                onChange={(e) =>
                  setAssignAdmin({ ...assignAdmin, phone: e.target.value })
                }
              />
              <div className="modal-actions">
                <button className="btn-save" onClick={handleAssignAdmin}>
                  Assign
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

// Reusable Modal
function Modal({ children }) {
  return (
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>
  );
}
