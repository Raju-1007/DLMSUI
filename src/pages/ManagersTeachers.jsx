import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function ManagersTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useMessage();

  const [loading, setLoading] = useState(true);

  // popup state
  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
  });

  // load teachers
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/admin/teachers");
      setTeachers(res.data || []);
    } catch {
      // fallback data
      setTeachers([
        {
          id: 1,
          teacherId: "TR001",
          name: "Ramesh",
          email: "ramesh@school.com",
          phone: "9876543210",
          department: "Mathematics",
          qualification: "M.Sc Mathematics",
        },
        {
          id: 2,
          teacherId: "TR002",
          name: "Suresh",
          email: "suresh@school.com",
          phone: "9900123456",
          department: "Science",
          qualification: "M.Sc Physics",
        },
      ]);
    }
    setLoading(false);
  };

  const openAddPopup = () => {
    setEditing(false);
    setForm({
      id: "",
      teacherId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      qualification: "",
    });
    setShowPopup(true);
  };

  const openEditPopup = (t) => {
    setEditing(true);
    setForm(t);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const saveTeacher = async () => {
    if (!form.teacherId || !form.name || !form.email || !form.phone) {
      showError("pleasefill all required fields");
      return;
    }

    let entry = { ...form };

    if (editing) {
      // update teacher
      try {
        await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/teachers/${form.id}`,
          entry
        );
      } catch {}

      setTeachers((prev) =>
        prev.map((t) => (t.id === form.id ? entry : t))
      );
      showSuccess("Teacher updated ✔");
    } else {
      entry.id = Date.now();
      try {
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/admin/teachers",
          entry
        );
        setTeachers((prev) => [...prev, res.data || entry]);
      } catch {
        setTeachers((prev) => [...prev, entry]);
      }

      showSuccess("Teacher added ✔");
    }

    closePopup();
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_BASE_URL+`/api/admin/teachers/${id}`);
    } catch {}

    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">

          <h2 className="admin-page-title">Manage Teachers</h2>

          <div className="admin-top-actions">
            <input
              className="admin-search"
              placeholder="Search Teacher by ID / Name / Dept…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="admin-add-btn" onClick={openAddPopup}>
              + Add Teacher
            </button>
          </div>

          <div className="admin-box">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Qualification</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers
                    .filter((t) =>
                      (
                        t.teacherId +
                        t.name +
                        t.department +
                        t.email
                      )
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((t) => (
                      <tr key={t.id}>
                        <td>{t.teacherId}</td>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                        <td>{t.phone}</td>
                        <td>{t.department}</td>
                        <td>{t.qualification}</td>

                        <td>
                          <button
                            className="admin-action-btn edit"
                            onClick={() => openEditPopup(t)}
                          >
                            Edit
                          </button>

                          <button
                            className="admin-action-btn delete"
                            onClick={() => deleteTeacher(t.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ====================== POPUP ====================== */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-header">
              <h3 className="admin-popup-title">
                {editing ? "Edit Teacher" : "Add Teacher"}
              </h3>
              <span className="admin-popup-close" onClick={closePopup}>
                ✕
              </span>
            </div>

            <label>Teacher ID *</label>
            <input
              value={form.teacherId}
              onChange={(e) =>
                setForm({ ...form, teacherId: e.target.value })
              }
              placeholder="TR001"
            />

            <label>Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ramesh"
            />

            <label>Email *</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="teacher@gmail.com"
            />

            <label>Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="9876543210"
            />

            <label>Department</label>
            <input
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              placeholder="Mathematics"
            />

            <label>Qualification</label>
            <input
              value={form.qualification}
              onChange={(e) =>
                setForm({ ...form, qualification: e.target.value })
              }
              placeholder="M.Sc Mathematics"
            />

            <div className="admin-popup-actions">
              <button className="admin-btn-secondary" onClick={closePopup}>
                Cancel
              </button>

              <button className="admin-btn-primary" onClick={saveTeacher}>
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
