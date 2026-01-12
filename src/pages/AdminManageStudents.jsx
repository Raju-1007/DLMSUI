import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 



export default function AdminManageStudents() {

  const { showSuccess, showError } = useMessage();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // popup states
  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    studentId: "",
    name: "",
    className: "",
    section: "",
    phone: "",
    email: "",
  });

  // Load students
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/admin/students");
      setStudents(res.data || []);
    } catch {
      // fallback hardcoded data
      setStudents([
        {
          id: 1,
          studentId: "ST001",
          name: "Krishna Varma",
          className: "8",
          section: "A",
          phone: "9876543210",
          email: "krishna@student.com",
        },
        {
          id: 2,
          studentId: "ST002",
          name: "Ramesh",
          className: "9",
          section: "B",
          phone: "9700011223",
          email: "ramesh@student.com",
        },
      ]);
    }
    setLoading(false);
  };

  const openAddPopup = () => {
    setEditing(false);
    setForm({
      id: "",
      studentId: "",
      name: "",
      className: "",
      section: "",
      phone: "",
      email: "",
    });
    setShowPopup(true);
  };

  const openEditPopup = (s) => {
    setEditing(true);
    setForm(s);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const saveStudent = async () => {
    if (!form.studentId || !form.name || !form.className || !form.section) {
      showError("pleasefill all required fields");
      return;
    }

    let entry = { ...form };

    if (editing) {
      // update student
      try {
        await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/students/${form.id}`,
          entry
        );
      } catch {}

      setStudents((prev) => prev.map((s) => (s.id === form.id ? entry : s)));
      showSuccess("Student updated ✔");
    } else {
      entry.id = Date.now();
      try {
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/admin/students",
          entry
        );
        setStudents((prev) => [...prev, res.data || entry]);
      } catch {
        setStudents((prev) => [...prev, entry]);
      }
      showSuccess("Student added ✔");
    }

    closePopup();
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_BASE_URL+`/api/admin/students/${id}`);
    } catch {}

    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">

          <h2 className="admin-page-title">Manage Student</h2>

          <div className="admin-top-actions">
            <input
              className="admin-search"
              placeholder="Search Student by ID / Name / Class / Section…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="admin-add-btn" onClick={openAddPopup}>
              + Add Student
            </button>
          </div>

          <div className="admin-box">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students
                    .filter((s) =>
                      (
                        s.studentId +
                        s.name +
                        s.className +
                        s.section +
                        s.email
                      )
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((s) => (
                      <tr key={s.id}>
                        <td>{s.studentId}</td>
                        <td>{s.name}</td>
                        <td>{s.className}</td>
                        <td>{s.section}</td>
                        <td>{s.phone}</td>
                        <td>{s.email}</td>

                        <td>
                          <button
                            className="admin-action-btn edit"
                            onClick={() => openEditPopup(s)}
                          >
                            Edit
                          </button>

                          <button
                            className="admin-action-btn delete"
                            onClick={() => deleteStudent(s.id)}
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

      {/* POPUP */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-header">
              <h3 className="admin-popup-title">
                {editing ? "Edit Student" : "Add Student"}
              </h3>
              <span className="admin-popup-close" onClick={closePopup}>
                ✕
              </span>
            </div>

            <label>Student ID *</label>
            <input
              value={form.studentId}
              onChange={(e) =>
                setForm({ ...form, studentId: e.target.value })
              }
              placeholder="ST001"
            />

            <label>Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter student name"
            />

            <label>Class *</label>
            <input
              value={form.className}
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
              placeholder="8"
            />

            <label>Section *</label>
            <input
              value={form.section}
              onChange={(e) =>
                setForm({ ...form, section: e.target.value })
              }
              placeholder="A"
            />

            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="9876543210"
            />

            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="student@gmail.com"
            />

            <div className="admin-popup-actions">
              <button className="admin-btn-secondary" onClick={closePopup}>
                Cancel
              </button>

              <button className="admin-btn-primary" onClick={saveStudent}>
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
