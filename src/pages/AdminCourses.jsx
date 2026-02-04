// src/pages/AdminCourses.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import MessageModal from "../components/MessageModal";
import { useMessage } from "../context/MessageContext"; 


export default function AdminCourses() {
  const { showSuccess, showError } = useMessage();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [messageData, setMessageData] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    category: "",
    startDate: "",
    endDate: "",
    duration: "",
    syllabus: ""
  });

  // ================= LOAD COURSES =================
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/content/getCourses");
      setCourses(res.data || []);
    } catch {
      // fallback dummy data
      setCourses([
        {
          id: 1,
          courseId: "C1001",
          title: "Mathematics – Grade 8",
          category: "Mathematics",
          startDate: "2025-01-01",
          endDate: "2025-02-14",
          duration: "45 Days",
          syllabus: "Ch 1 – Ch 6"
        }
      ]);
    }
    setLoading(false);
  };

  // ================= DURATION CALCULATION =================
  const calculateDuration = (start, end) => {
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime < 0) return "";

    const diffDays =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return `${diffDays} Days`;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "startDate" || field === "endDate") {
        updated.duration = calculateDuration(
          updated.startDate,
          updated.endDate
        );
      }

      return updated;
    });
  };

  // ================= POPUP HANDLERS =================
  const openAddPopup = () => {
    setEditingCourse(null);
    setForm({
      courseId: "",
      title: "",
      category: "",
      startDate: "",
      endDate: "",
      duration: "",
      syllabus: ""
    });
    setShowPopup(true);
  };

  const openEditPopup = (course) => {
    setEditingCourse(course);
    setForm(course);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingCourse(null);
  };

  // ================= SAVE COURSE =================
  const saveCourse = async (e) => {
    e.preventDefault();

    if (!form.courseId || !form.title) {
      showSuccess("Course ID and Title required");
      setMessageData({
        type:"error",
        message:"Course ID title required"
      })
      return;
    }

    if (editingCourse) {
      try {
        const res = await axios.put(
          import.meta.env.VITE_API_BASE_URL+`/api/admin/courses/${editingCourse.id}`,
          form
        );
        const updated = res.data || form;
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourse.id ? updated : c
          )
        );
      } catch {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourse.id ? { ...c, ...form } : c
          )
        );
      }
    } else {
      try {
        console.log(form,"=====================>====================");
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL+"/api/courses/addCourses",
          form
        );
        const newCourse = res.data || { id: Date.now(), ...form };
        setCourses((prev) => [...prev, newCourse]);
      } catch {
        const fake = { id: Date.now(), ...form };
        setCourses((prev) => [...prev, fake]);
      }
    }

    closePopup();
  };

  // ================= DELETE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(
        import.meta.env.VITE_API_BASE_URL+`/api/admin/courses/${id}`
      );
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // ================= SEARCH =================
  const filtered = courses.filter((c) => {
    const text =
      `${c.courseId} ${c.title} ${c.category}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">Manage Courses</h2>

          <div className="admin-box">
            <div className="admin-top-row">
              {/* <button
                className="admin-btn-primary"
                onClick={openAddPopup}
              >
                + Add Course
              </button> */}

              <input
                className="admin-search"
                placeholder="Search by ID / Title / Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject ID</th>
                    <th>subjectName</th>
                    <th>PassScore</th>
                    {/* <th>Duration</th>
                    <th>Syllabus</th>
                    <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>{c.subjectId}</td>
                      <td>{c.subjectName}</td>
                      <td>{c.passScore}</td>
                      {/* <td>{c.duration}</td>
                      <td>{c.syllabus}</td>
                      <td>
                        <button
                          className="admin-action-btn edit"
                          onClick={() => openEditPopup(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => deleteCourse(c.id)}
                        >
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No courses found
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
          <div
            className="admin-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-popup-header">
              <h3>
                {editingCourse ? "Edit Course" : "Add Course"}
              </h3>
              <span onClick={closePopup}>✕</span>
            </div>

            <form onSubmit={saveCourse}>
              <label>Course ID</label>
              <input
                value={form.courseId}
                onChange={(e) =>
                  handleChange("courseId", e.target.value)
                }
              />

              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
              />

              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
              />

              <label>Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  handleChange("startDate", e.target.value)
                }
              />

              <label>End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  handleChange("endDate", e.target.value)
                }
              />

              <label>Duration</label>
              <input
                value={form.duration}
                readOnly
                style={{
                  background: "#f1f5f9",
                  fontWeight: "600"
                }}
              />

              <label>Syllabus</label>
              <textarea className="textArea"
                rows={3}
                value={form.syllabus}
                onChange={(e) =>
                  handleChange("syllabus", e.target.value)
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
                <button
                  type="submit"
                  className="admin-btn-primary"
                >
                  {editingCourse ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <MessageModal
        type={messageData.type}
        message={messageData.message}
        onClose={() => setMessageData({ type: "", message: "" })}
      />
    </div>
  );
}
