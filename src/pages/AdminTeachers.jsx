// src/pages/AdminTeachers.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 



export default function AdminTeachers() {
  const { showSuccess, showError } = useMessage();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // popup state
  const [showPopup, setShowPopup] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // form state
  const [form, setForm] = useState({
    teacherId: "",
    name: "",
    department: "",
    email: "",
    phone: "",
    status: "Active",
    joiningDate: "",
    rating: 5,
  });

  // ========= LOAD TEACHERS =========
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_BASE_URL+"/api/instructor/getinstructorDetails"
          
        );
        setTeachers(res.data || []);
      } catch(err) {
        // fallback demo data
        setTeachers([
          {
            id: 1,
            teacherId: "TCH1001",
            name: "Ruturaj",
            department: "Skill Development",
            email: "ruturaj@example.com",
            phone: "9876543210",
            status: "Active",
            joiningDate: "2021-06-10",
            rating: 5,
          },
          {
            id: 2,
            teacherId: "TCH1002",
            name: "Gambhir",
            department: "DMI Tool",
            email: "gambhir@example.com",
            phone: "9876500011",
            status: "Active",
            joiningDate: "2020-01-05",
            rating: 4,
          },
          {
            id: 3,
            teacherId: "TCH1003",
            name: "Dhawan",
            department: "Data Entry",
            email: "dhawan@example.com",
            phone: "9000000001",
            status: "Inactive",
            joiningDate: "2019-11-13",
            rating: 3,
          },
        ]);
      }
      setLoading(false);
    };

    load();
  }, []);

  // ========= helpers =========
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddPopup = () => {
    setEditingTeacher(null);
    setForm({
      teacherId: "",
      name: "",
      department: "",
      email: "",
      phone: "",
      status: "Active",
      joiningDate: "",
      rating: 5,
    });
    setShowPopup(true);
  };

  const openEditPopup = (t) => {
    setEditingTeacher(t);
    setForm({
      teacherId: t.teacherId || "",
      name: t.name || "",
      department: t.department || "",
      email: t.email || "",
      phone: t.phone || "",
      status: t.status || "Active",
      joiningDate: t.joiningDate || "",
      rating: t.rating ?? 5,
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingTeacher(null);
  };

  // ========= SAVE (ADD / EDIT) =========
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.teacherId || !form.name || !form.department) {
      showError("Teacher ID, Name and Department are required");
      return;
    }

    const payload = { ...form, rating: Number(form.rating || 0) };

    if (editingTeacher) {
      // EDIT
      try {
        const res = await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/teachers/${editingTeacher.id}`,
          payload
        );
        const updated = res.data || { ...editingTeacher, ...payload };
        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? updated : t))
        );
        showSuccess("Teacher updated");
      } catch {
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === editingTeacher.id ? { ...t, ...payload } : t
          )
        );
        showError("API failed. Updated only in UI.");
      }
    } else {
      // ADD
      try {
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/admin/teachers",
          payload
        );
        const newTeacher = res.data || { id: Date.now(), ...payload };
        setTeachers((prev) => [...prev, newTeacher]);
        showSuccess("Teacher added");
      } catch {
        const fake = { id: Date.now(), ...payload };
        setTeachers((prev) => [...prev, fake]);
        showSuccess("API failed. Added only in UI.");
      }
    }

    closePopup();
  };

  // ========= DELETE =========
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL+`/api/admin/teachers/${id}`
      );
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      showSuccess("Teacher deleted");
    } catch {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      showError("API failed. Removed only from UI");
    }
  };

  // ========= FILTER =========
  const filtered = teachers.filter((t) => {
    if (!search) return true;
    const text = `${t.teacherId} ${t.name} ${t.department}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // helper to show stars
  const renderStars = (rating) => {
    const r = Number(rating || 0);
    return "★".repeat(r) + "☆".repeat(5 - r);
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">Manage Teachers</h2>

          <div className="admin-box">
            {/* TOP ROW */}
            <div className="admin-top-row">
              <button className="admin-btn-primary" onClick={openAddPopup}>
                + Add Teacher
              </button>

              <input
                type="text"
                className="admin-search"
                placeholder="Search by ID / Name / Department"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* TABLE */}
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joining Date</th>
                    <th>Rating</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td>{t.loginId}</td>
                      <td>{t.name}</td>
                      <td>{t.department}</td>
                      <td>{t.email}</td>
                      <td>{t.mobile}</td>
                      <td>{t.joiningDate}</td>
                      <td className="admin-rating">{renderStars(t.rating)}</td>
                      <td>{t.subjects}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            t.status === "Active"
                              ? "badge-green"
                              : "badge-red"
                          }`}
                        >
                          {t.yearCompleted}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn edit"
                          onClick={() => openEditPopup(t)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div
            className="admin-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-popup-header">
              <h3 className="admin-popup-title">
                {editingTeacher ? "Edit Teacher" : "Add Teacher"}
              </h3>
              <span className="admin-popup-close" onClick={closePopup}>
                ✕
              </span>
            </div>

            <form onSubmit={handleSave}>
              <label>Teacher ID</label>
              <input
                value={form.teacherId}
                onChange={(e) =>
                  handleChange("teacherId", e.target.value)
                }
              />

              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
              />

              <label>Department</label>
              <input
                value={form.department}
                onChange={(e) =>
                  handleChange("department", e.target.value)
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />

              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />

              <label>Joining Date</label>
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) =>
                  handleChange("joiningDate", e.target.value)
                }
              />

              <label>Status</label>
              <select  className="addStatuse status-select" 
  
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <label>Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  handleChange("rating", e.target.value)
                }
              />

              <div className="admin-popup-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingTeacher ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
