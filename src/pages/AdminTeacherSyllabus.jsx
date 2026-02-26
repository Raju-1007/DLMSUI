import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";

export default function AdminTeacherSyllabus() {

  const { showSuccess, showError } = useMessage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(0);
        const [size] = useState(5);
        const[totalPages,setTotalPages]=useState("");

  const [form, setForm] = useState({
    timingId: "",
    dayOfWeek: "",
    classId: "",
    subjectId: "",
    startTime: "",
    endTime: ""
  });

  /* ---------------- LOAD ACADEMIC TIMETABLE ---------------- */
  useEffect(() => {
    loadTimeTable();
  }, [page,size]);

  const loadTimeTable = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/content/teachertimeTableDetails`,{
          params:
          {
            page:page,
            size:size
          }
        }
      );
      setItems(res.data.content || []);
       setTotalPages(res.data.totalPages || 0);

    } catch (error) {
      showError("Error loading academic timetable");
    }
    setLoading(false);
  };

  /* ---------------- POPUP HANDLERS ---------------- */
  const openEditPopup = (item) => {
    setEditing(true);
    setForm(item);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditing(false);
  };

  /* ---------------- UPDATE ---------------- */
  const save = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/content/teachertimeTableDetails/${form.timingId}`,
        form
      );

      setItems(prev =>
        prev.map(i => i.timingId === form.timingId ? form : i)
      );

      showSuccess("Timetable Updated ✔");
      closePopup();

    } catch (error) {
      showError("Update failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteItem = async (timingId) => {
    if (!window.confirm("Delete this timetable entry?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/content/teachertimeTableDetails/${timingId}`
      );

      setItems(prev => prev.filter(i => i.timingId !== timingId));
      showSuccess("Timetable Deleted ✔");

    } catch (error) {
      showError("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="admin-page-title">
            Academic Year TimeTable Management
          </h2>

          {/* SEARCH */}
          <div className="admin-top-actions">
            <input
              className="admin-search"
              placeholder="Search by Day / Class ID / Subject ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="admin-box">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Class ID</th>
                    <th>Subject ID</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items
                    .filter(i =>
                      (
                        i.dayOfWeek +
                        i.classId +
                        i.subjectId
                      )
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map(i => (
                      <tr key={i.timingId}>
                        <td>{i.dayOfWeek}</td>
                        <td>{i.classId}</td>
                        <td>{i.subjectId}</td>
                        <td>{i.startTime}</td>
                        <td>{i.endTime}</td>
                        <td>{i.durationMinutes} mins</td>
                        <td>
                          <button
                            className="admin-action-btn edit"
                            onClick={() => openEditPopup(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => deleteItem(i.timingId)}
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
           <div className="admin-pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>

        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="admin-overlay" onClick={closePopup}>
          <div className="admin-popup" onClick={(e) => e.stopPropagation()}>

            <div className="admin-popup-header">
              <h3>Edit Timetable</h3>
              <span onClick={closePopup}>✕</span>
            </div>

            <label>Day</label>
            <input value={form.dayOfWeek} readOnly />

            <label>Class ID</label>
            <input value={form.classId} readOnly />

            <label>Subject ID</label>
            <input value={form.subjectId} readOnly />

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
              <button className="button" onClick={save}>Update</button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
