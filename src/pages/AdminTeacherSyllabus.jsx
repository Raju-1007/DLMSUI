import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 
export default function AdminTeacherSyllabus() {
  const { showSuccess, showError } = useMessage();

  const [items, setItems] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    teacherId: "",
    teacherName: "",
    subject: "",
    className: "",
    section: "",
    syllabusTitle: "",
    description: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  // ---------------- LOAD SYLLABUS ----------------
  useEffect(() => {
    loadSyllabus();
  }, []);

  const loadSyllabus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+"/notify/api/getMappings"
      );
      setItems(res.data || []);
    } catch (error) {
     showError("Error loading syllabus", error);
      setItems([]);
    }
    setLoading(false);
  };

  // ---------------- LOAD TEACHERS ----------------
 
  // ---------------- POPUP HANDLERS ----------------
  const openAddPopup = () => {
    setEditing(false);
    setForm({
      id: "",
      teacherId: "",
      teacherName: "",
      subject: "",
      className: "",
      section: "",
      syllabusTitle: "",
      description: "",
      date: "",
      startTime: "",
      endTime: ""
    });
    setShowPopup(true);
  };

  const openEditPopup = (item) => {
    setEditing(true);
    setForm(item);
   
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  // ---------------- SAVE ----------------
  const save = async () => {
    if (
      !form.teacherId ||
      !form.subject ||
      !form.className ||
      !form.section ||
      !form.syllabusTitle ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      showError("pleasefill all required fields");
      return;
    }

    if (editing) {
      try {
        await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/syllabus/${form.id}`,
          form
        );
      } catch (error) {
        showError("Update failed", error);
      }
      setItems(prev =>
        prev.map(i => (i.id === form.id ? form : i))
      );
      showSuccess("Syllabus Updated ✔");
    } else {
      const entry = { ...form, id: Date.now() };
      try {
        await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/admin/syllabus",
          entry
        );
      } catch (error) {
        showError("Create failed", error);
      }
      setItems(prev => [...prev, entry]);
      showSuccess("Syllabus Assigned ✔");
    }

    closePopup();
  };

  // ---------------- DELETE SYLLABUS ----------------
  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete syllabus?")) return;

    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL+`/api/admin/syllabus/${id}`
      );
    } catch (error) {
     showError("Delete failed", error);
    }

    setItems(prev => prev.filter(i => i.id !== id));
  };

  // ---------------- ATTENDANCE ----------------
  const handleAttendance = (item) => {
    localStorage.setItem(
      "attendanceTeacher",
      JSON.stringify({
        teacherId: item.teacherId,
        teacherName: item.teacherName,
        subject: item.subject,
        className: item.className,
        section: item.section
      })
    );
    window.location.href = "/admin/teacher-attendance";
  };

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">
            Teacher Syllabus Management
          </h2>

          {/* SEARCH + ADD */}
          <div className="admin-top-actions">
            <input
              className="admin-search"
              placeholder="Search by Teacher / Subject / Class / Section"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button className="admin-add-btn" onClick={openAddPopup}>
              + Assign Syllabus
            </button> */}
          </div>

          {/* TABLE */}
          <div className="admin-box">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Teacher ID</th>
                    <th>Teacher Name</th>
                    <th>Subject</th>
                    <th>Class</th>
                    
                    <th>department</th>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>

                <tbody>
                  {items
                    .filter(i =>
                      (
                        i.teacherName +
                        i.teacherId +
                        i.subjects +
                        i.classNames 
                        
                      )
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map(i => (
                      <tr key={i.id}>
                        <td>{i.teacherId}</td>
                        <td>{i.teacherName}</td>
                        <td>{i.subjects}</td>
                        <td>{i.classNames}</td>
                    
                        <td>{i.department}</td>
                        <td>{i.date}</td>
                        <td>{i.startTime}</td>
                        <td>{i.endTime}</td>
                        {/* <td> */}
                          {/* <button
                            className="admin-action-btn edit"
                            onClick={() => openEditPopup(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => deleteItem(i.id)}
                          >
                            Delete
                          </button> */}
                          {/* <button
                            className="admin-action-btn attendance"
                            onClick={() => handleAttendance(i)}
                          >
                            Attendance
                          </button> */}
                        {/* </td> */}
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
              <h3>{editing ? "Edit Syllabus" : "Assign Syllabus"}</h3>
              <span onClick={closePopup}>✕</span>
            </div>

            <label>Teacher</label>
            <select
              value={form.teacherId}
              onChange={(e) => {
                const id = e.target.value;
                const t = teachers.find(
                  x => String(x.loginid) === id
                );
                setForm({
                  ...form,
                  teacherId: id,
                  teacherName: t ? t.fullName : ""
                });
              }}
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
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

            <label>Class</label>
            <input
              value={form.className}
              onChange={(e) =>
                setForm({ ...form, className: e.target.value })
              }
            />

            <label>Section</label>
            <input
              value={form.section}
              onChange={(e) =>
                setForm({ ...form, section: e.target.value })
              }
            />

            <label>Syllabus Title</label>
            <input
              value={form.syllabusTitle}
              onChange={(e) =>
                setForm({ ...form, syllabusTitle: e.target.value })
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

            <label>Start Time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />

            <label>End Time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
            />

            <div className="admin-popup-actions">
              <button className="button" onClick={closePopup}>Cancel</button>
              <button  className="button" onClick={save}>
                {editing ? "Update" : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
