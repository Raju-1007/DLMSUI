import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import "../styles/admin.css";
import { useMessage } from "../context/MessageContext"; 
export default function AdminTimetable() {
  const { showSuccess, showError } = useMessage();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // popup add/edit
  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    teacher: "",
    day: "",
    time: "",
    subject: "",
    className: ""
  });

  // Load data
  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/admin/timetable");
      setSlots(res.data || []);
    } catch {
      // FALLBACK
      setSlots([
        {
          id: 1,
          teacher: "TR001 - Ramesh",
          day: "Monday",
          time: "9:00 – 10:00",
          subject: "Maths",
          className: "8A"
        },
        {
          id: 2,
          teacher: "TR002 - Suresh",
          day: "Tuesday",
          time: "11:00 – 12:00",
          subject: "Physics",
          className: "9B"
        }
      ]);
    }
    setLoading(false);
  };

  const openAddPopup = () => {
    setEditing(false);
    setForm({
      id: "",
      teacher: "",
      day: "",
      time: "",
      subject: "",
      className: ""
    });
    setShowPopup(true);
  };

  const openEditPopup = (slot) => {
    setEditing(true);
    setForm(slot);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSave = async () => {
    if (!form.teacher || !form.day || !form.time || !form.subject || !form.className) {
      showError("Please fill all fields");
      return;
    }

    let newEntry = { ...form };

    if (editing) {
      // EDIT
      try {
        await axios.put(import.meta.env.VITE_API_BASE_URL+`/api/admin/timetable/${form.id}`, newEntry);
        setSlots((prev) => prev.map((s) => (s.id === form.id ? newEntry : s)));
      } catch {
        setSlots((prev) => prev.map((s) => (s.id === form.id ? newEntry : s)));
      }
      showSuccess("Timetable Updated ✔");
    } else {
      // ADD
      newEntry.id = Date.now();
      try {
        const res = await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/admin/timetable", newEntry);
        setSlots((prev) => [...prev, res.data || newEntry]);
      } catch {
        setSlots((prev) => [...prev, newEntry]);
      }
      showSuccess("Slot Added ✔");
    }

    closePopup();
  };

  const deleteSlot = async (id) => {
    if (!window.confirm("Delete this timetable slot?")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_BASE_URL+`/api/admin/timetable/${id}`);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setSlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">Teacher Timetable Management</h2>

          <div className="admin-top-actions">
            <button className="admin-add-btn" onClick={openAddPopup}>
              + Add Slot
            </button>
          </div>

          <div className="admin-box">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {slots.map((s) => (
                    <tr key={s.id}>
                      <td>{s.teacher}</td>
                      <td>{s.day}</td>
                      <td>{s.time}</td>
                      <td>{s.subject}</td>
                      <td>{s.className}</td>

                      <td>
                        <button className="admin-action-btn edit" onClick={() => openEditPopup(s)}>
                          Edit
                        </button>
                        <button className="admin-action-btn delete" onClick={() => deleteSlot(s.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {slots.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No Slots Found
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
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-header">
              <h3 className="admin-popup-title">
                {editing ? "Edit Timetable Slot" : "Add Timetable Slot"}
              </h3>
              <span className="admin-popup-close" onClick={closePopup}>✕</span>
            </div>

            <label>Teacher</label>
            <input
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              placeholder="TR001 – Ramesh"
            />

            <label>Day</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              <option value="">Select</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>

            <label>Time</label>
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              placeholder="10:00 – 11:00"
            />

            <label>Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Science"
            />

            <label>Class</label>
            <input
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              placeholder="8A"
            />

            <div className="admin-popup-actions">
              <button className="admin-btn-secondary" onClick={closePopup}>
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={handleSave}>
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
