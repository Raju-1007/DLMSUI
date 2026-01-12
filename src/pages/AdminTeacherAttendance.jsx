import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

import { useMessage } from "../context/MessageContext"; 


export default function AdminTeacherAttendance() {

  const { showSuccess, showError } = useMessage();
  const [records, setRecords] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    teacherId: "",
    teacherName: "",
    subject: "",
    date: "",
    status: "Present",
  });

  // ================= LOAD ATTENDANCE =================
  useEffect(() => {
    loadAttendance();
    loadTeachers();
  }, []);



  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/api/admin/teacherAttendance"
      );
      setRecords(res.data || []);
    } catch(err) {
       showError("Error loading attendance", err);
      setRecords([]);
    }
    setLoading(false);
  };

  // ================= LOAD TEACHERS =================
  const loadTeachers = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/api/admin/users/teachers"
      );
      setTeachers(res.data || []);
    } catch(err) {
       showError("Error loading teachers", err);
    }
  };

  // ================= POPUP HANDLERS =================
  const openAddPopup = () => {
    setForm({
      id: "",
      teacherId: "",
      teacherName: "",
      subject: "",
      date: "",
      status: "Present",
    });
    setIsEditing(false);
    loadTeachers();
    setShowPopup(true);
  };

  const openEditPopup = (rec) => {
    setForm(rec);
    setIsEditing(true);
    loadTeachers();
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  // ================= SAVE =================
  const saveRecord = async (e) => {
    e.preventDefault();

    if (!form.teacherId || !form.teacherName || !form.date) {
      showSuccess("Teacher, Date are required");
      return;
    }

    if (isEditing) {
      try {
        await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/teacherAttendance/${form.id}`,
          form
        );
      } catch {}
      setRecords((p) =>
        p.map((r) => (r.id === form.id ? form : r))
      );
    } else {
      const entry = { ...form, id: Date.now() };
      try {
        await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/admin/teacherAttendance",
          entry
        );
      } catch {}
      setRecords((p) => [...p, entry]);
    }

    closePopup();
  };

  // ================= DELETE =================
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL+`/api/admin/teacherAttendance/${id}`
      );
    } catch {}
    setRecords((p) => p.filter((r) => r.id !== id));
  };

  // ================= FILTER =================
  const filtered = records.filter((r) =>
    `${r.teacherId} ${r.teacherName} ${r.subject} ${r.date} ${r.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">Teacher Attendance (Admin)</h2>

          <div className="admin-box">
            {/* TOP ROW */}
            <div className="admin-top-row">
              <button className="admin-btn-primary" onClick={openAddPopup}>
                + Add Attendance
              </button>

              <input
                className="admin-search"
                placeholder="Search by Teacher / Date / Status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* TABLE */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((rec) => (
                    <tr key={rec.id}>
                      <td>{rec.teacherId}</td>
                      <td>{rec.teacherName}</td>
                      <td>{rec.subject}</td>
                      <td>{rec.date}</td>
                      <td>
                        <span
                          className={`att-badge ${
                            rec.status === "Present"
                              ? "green"
                              : rec.status === "Absent"
                              ? "red"
                              : "yellow"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn edit"
                          onClick={() => openEditPopup(rec)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => deleteRecord(rec.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-header">
              <h3>{isEditing ? "Edit Attendance" : "Add Attendance"}</h3>
              <span className="admin-popup-close" onClick={closePopup}>
                ✕
              </span>
            </div>

            <form onSubmit={saveRecord}>
              {/* Teacher Dropdown */}
              <label>Teacher</label>
              <select  className="addStatuse status-select"
                value={form.teacherId}
                onChange={(e) => {
                  const id = e.target.value;
                  const t = teachers.find(
                    (x) => String(x.loginid) === id
                  );
                  setForm({
                    ...form,
                    teacherId: id,
                    teacherName: t ? t.fullName : "",
                  });
                }}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.loginid} value={t.loginid}>
                    {t.fullName} (ID: {t.loginid})
                  </option>
                ))}
              </select>

              <label>Teacher Name</label>
              <input value={form.teacherName} readOnly />

              <label>Subject</label>
              <input
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />

              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <label>Status</label>
              <select className="addStatuse status-select"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
                <option>Leave</option>
              </select>

              <div className="admin-popup-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {isEditing ? "Update" : "Save"}
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
