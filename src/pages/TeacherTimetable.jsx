import React, { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const localizer = dayjsLocalizer(dayjs);
function TeamsEvent({ event }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#2f6fad",
        color: "#fff",
        borderRadius: "6px",
        padding: "6px 8px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "normal",   // ✅ horizontal text
          wordBreak: "keep-all",  // ❌ no vertical letters
        }}
      >
        {event.title}
      </div>
    </div>
  );
}

const eventStyleGetter = () => ({
  style: {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
  },
});


export default function TeacherTimetable() {
  const { showSuccess, showError } = useMessage();
  const login = useSelector((state) => state.auth.user);
  const { state } = useLocation();
  const timetable = state?.timetable;
  const teacherMeta = state?.teacherMeta;
  const teacherdata = state?.timetable

 


  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);

  const [studentsIds, setStudentsIds] = useState([]);
  const [classList, setClassList] = useState([]);

  const [scheduleData, setScheduleData] = useState({
    date: "",
    startTime: teacherdata.startTime,
    endTime: teacherdata.endTime,
    classId: teacherMeta.classId,
    className: teacherMeta.className,
    description: teacherMeta.subjectName,
    studentId: "",
    studentName: "",

    remind: false,
  });

  /* ================= LOAD TIMETABLE ================= */
  useEffect(() => {
    if (!login?.userDetails?.loginid) return;

    const loadTimetable = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/notify/api/getMappings`
        );

        const mappedEvents = res.data.map((item) => ({
          id: item.id,
          title: `${item.subjects} (${item.classNames})`,
          start: dayjs(`${item.date} ${item.startTime}`).toDate(),
          end: dayjs(`${item.date} ${item.endTime}`).toDate(),
          description: item.description,
          teacherName: item.teacherName,
          department: item.department,
        }));

        setEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      }
    };

    loadTimetable();
  }, [login]);

  useEffect(() => {
    if (!showSchedulePopup || !teacherMeta) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/login/login/getStudentsByLocation`, {
        params: {
          districtId: teacherMeta.districtId,
          mandalId: teacherMeta.mandalId,
          villageId: teacherMeta.villageId,
          classId: teacherMeta.classId
        }
      })
      .then((res) => {
        setStudentsIds([
          { loginid: "ALL", fullName: "All Students" }, // ✅ ALL option
          ...(res.data || [])
        ]);
      })
      .catch(() => setStudentsIds([]));

  }, [showSchedulePopup, teacherMeta]);


  /* ================= HANDLERS ================= */
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleScheduleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScheduleData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateDuration = () => {
    if (!scheduleData.startTime || !scheduleData.endTime) return "--";
    const start = dayjs(`2024-01-01 ${scheduleData.startTime}`);
    const end = dayjs(`2024-01-01 ${scheduleData.endTime}`);
    return `${end.diff(start, "minute")} minutes`;
  };

  const handleSaveSchedule = async () => {
    const payload = {
      ...scheduleData,
      teacherId: login?.userDetails?.loginid,

    };

    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/addStudentMeetings`,
        payload
      );
      showSuccess("Meeting scheduled successfully");
      setShowSchedulePopup(false);
    } catch {
      showError("Failed to schedule meeting");
    }
  };

  /* ================= UI ================= */
  return (



    <>
      <Navbar />
      <div className="page-grid">
        <Sidebar />

        <div className="tt-wrapper">
          <div className="tt-top-row">
            <h2 className="tt-page-title">Teacher Timetable</h2>
            <button
              className="tt-schedule-btn"
              onClick={() => setShowSchedulePopup(true)}
            >
              Schedule My Timeline
            </button>
          </div>

          <div className="tt-card" style={{ height: "650px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              views={["week", "day", "agenda"]}
              onSelectEvent={handleSelectEvent}

              /* 🔑 MAIN FIX */
              dayLayoutAlgorithm="no-overlap"   // ⬅️ same time events stack vertically
              timeslots={1}
              step={30}

              components={{ event: TeamsEvent }}
              eventPropGetter={eventStyleGetter}
            />

          </div>
        </div>
      </div>

      {/* ================= VIEW EVENT ================= */}
      {selectedEvent && (
        <div className="tt-popup-overlay">
          <div className="tt-popup-box tt-view-box">
            <div className="tt-popup-header tt-popup-header-blue">
              <h3>{selectedEvent.title}</h3>
              <span
                className="tt-popup-close"
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </span>
            </div>

            <div className="tt-popup-body">
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">START</label>
                  <p>{dayjs(selectedEvent.start).format("DD MMM YYYY hh:mm A")}</p>
                </div>
                <div>
                  <label className="tt-label">END</label>
                  <p>{dayjs(selectedEvent.end).format("DD MMM YYYY hh:mm A")}</p>
                </div>
              </div>

              <div className="tt-desc-box">
                <label className="tt-label">DESCRIPTION</label>
                <p>{selectedEvent.description || "--"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCHEDULE POPUP ================= */}
      {showSchedulePopup && (
        <div
          className="tt-popup-overlay"
          onClick={() => setShowSchedulePopup(false)}
        >
          <div className="tt-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="tt-popup-header">
              <h3>Schedule Meeting</h3>
              <span
                className="tt-popup-close"
                onClick={() => setShowSchedulePopup(false)}
              >
                ✕
              </span>
            </div>

            <div className="tt-popup-body">
              {/* DATE */}
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">DATE</label>
                  <input
                    type="date"
                    className="tt-input"
                    value={scheduleData.date}
                    onChange={(e) =>
                      setScheduleData((p) => ({
                        ...p,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* TIME */}
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">START TIME</label>
                  <input
                    type="time"
                    className="tt-input"
                    value={scheduleData.startTime}
                    onChange={(e) =>
                      setScheduleData((p) => ({
                        ...p,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="tt-label">END TIME</label>
                  <input
                    type="time"
                    className="tt-input"
                    value={scheduleData.endTime}
                    onChange={(e) =>
                      setScheduleData((p) => ({
                        ...p,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* DURATION */}
              <div className="tt-duration">
                <label className="tt-label">DURATION</label>
                <p>{calculateDuration()}</p>
              </div>

              {/* CLASS (AUTO FROM teacherMeta) */}
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">CLASS</label>
                  <input
                    className="tt-input"
                    value={scheduleData.className || ""}
                    disabled
                  />
                </div>
              </div>

              {/* STUDENT */}
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">STUDENT</label>

                  <select
                    className="tt-input"
                    value={scheduleData.studentId || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ ALL students
                      if (value === "ALL") {
                        setScheduleData((p) => ({
                          ...p,
                          studentId: "ALL",
                          studentName: "All Students",
                        }));
                        return;
                      }

                      // ✅ Find student from API list
                      const selectedStudent = studentsIds.find(
                        (s) => String(s.studentid) === value
                      );

                      setScheduleData((p) => ({
                        ...p,
                        studentId: selectedStudent?.studentid || "",
                        studentName: selectedStudent?.student_Name || "",
                      }));
                    }}
                  >
                    <option value="">Select Student</option>
                    <option value="ALL">All Students</option>

                    {studentsIds.map((s) => (
                      <option key={s.studentid} value={s.studentid}>
                        {s.student_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>



              {/* DESCRIPTION (AUTO SUBJECT NAME) */}
              <div className="tt-desc-box">
                <label className="tt-label">DESCRIPTION</label>
                <textarea
                  className="tt-textarea"
                  value={scheduleData.description}
                  onChange={(e) =>
                    setScheduleData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* REMIND */}
              <label className="tt-remind">
                <input
                  type="checkbox"
                  checked={scheduleData.remind}
                  onChange={(e) =>
                    setScheduleData((p) => ({
                      ...p,
                      remind: e.target.checked,
                    }))
                  }
                />
                Remind Me
              </label>

              {/* SAVE */}
              <div className="tt-popup-footer">
                <button className="tt-save-btn" onClick={handleSaveSchedule}>
                  Save Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>

  );
}
