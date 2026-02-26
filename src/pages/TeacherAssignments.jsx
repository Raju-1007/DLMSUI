

import React, { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useMessage } from "../context/MessageContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 600 }}>
        {event.title}
      </div>
    </div>
  );
}

export default function TeacherAssignments() {
  const login = useSelector((state) => state.auth.user);
  const { showSuccess, showError } = useMessage();
  const [studentsIds, setStudentsIds]=useState();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);

  const [teacherProfile, setTeacherProfile] = useState(null);

  const [scheduleData, setScheduleData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    remind: false,
  });

  /* ================= LOAD CALENDAR ================= */
  useEffect(() => {
    if (!login?.userDetails?.loginid) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/notify/api/getMappings`)
      .then((res) => {
        const mapped = res.data.map((item) => ({
          id: item.id,
          title: `${item.subjects} (${item.classNames})`,
          start: dayjs(`${item.date} ${item.startTime}`).toDate(),
          end: dayjs(`${item.date} ${item.endTime}`).toDate(),
        }));
        setEvents(mapped);
      });
  }, [login]);

  /* ================= LOAD TEACHER PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/login/login/teacher/profile/${login?.userDetails?.loginid}`
        );
        setTeacherProfile(res.data);
      } catch {
        showError("Failed to load teacher profile");
      }
    };

    loadProfile();
    loadStudents(teacherProfile);
  }, [showSchedulePopup]);

  const loadStudents = async (teacherProfile) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/login/login/getStudentsByLocation`,
      {
        params: {
          districtId: teacherProfile.districtId,
          mandalId: teacherProfile.mandalId,
          villageId: teacherProfile.villageId,
          classId: teacherProfile.classId,
        },
      }
    );
    console.log(res.data,"studentsIdsstudentsIds");
    setStudentsIds(res.data || []);
   
  } catch (error) {
    console.error("Error loading students:", error);
    setStudentsIds([]);
  }
};
 
  /* ================= SAVE ASSIGNMENT ================= */
  const handleSaveSchedule = async () => {
    try {
      const startDateTime = dayjs(
  `${scheduleData.date} ${scheduleData.startTime}`
).toISOString();

const endDateTime = dayjs(
  `${scheduleData.date} ${scheduleData.endTime}`
).toISOString();


      const duration = dayjs(endDateTime).diff(
        dayjs(startDateTime),
        "minute"
      ) + " minutes";

      const payload = {
        teacherId: login?.userDetails?.loginid,
        subjectId: teacherProfile?.subjectId,
        classes: {
          class_id: teacherProfile?.classId,
        },
        
        schoolId: studentsIds?.schools[0]?.schoolId,
        startTime: startDateTime,
        endTime: endDateTime,
        startDate: startDateTime,
        endDate: endDateTime,
        duration: duration,
      };
     
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/addAssignmentsStudemts`,
        payload
      );

      const savedAssignment = res.data;

      showSuccess("Assignment Scheduled Successfully");
      setShowSchedulePopup(false);

      /* 🔥 Navigate to Question Builder with assignmentId */
      navigate(`/teacherQuestionBuilder/${savedAssignment.assignment_id}`, {
        state: {
          assignmentId: savedAssignment.assignment_id,
          classId: teacherProfile?.classId,
          subjectId: teacherProfile?.subjectId,
          teacherId: login?.userDetails?.loginid,
        },
      });
    } catch (error) {
      showError("Failed to schedule assignment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-grid">
        <Sidebar />

        <div className="tt-wrapper">
          <div className="tt-top-row">
            <h2 className="tt-page-title">Assignments</h2>
            <button
              className="tt-schedule-btn"
              onClick={() => setShowSchedulePopup(true)}
            >
              Schedule Assignment
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
              components={{ event: TeamsEvent }}
            />
          </div>
        </div>
      </div>

      {showSchedulePopup && (
        <div
          className="tt-popup-overlay"
          onClick={() => setShowSchedulePopup(false)}
        >
          <div className="tt-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="tt-popup-header">
              <h3>Schedule Assignment</h3>
              <span
                className="tt-popup-close"
                onClick={() => setShowSchedulePopup(false)}
              >
                ✕
              </span>
            </div>

            <div className="tt-popup-body">
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">DATE</label>
                  <input
                    type="date"
                    className="tt-input"
                    value={scheduleData.date}
                    onChange={(e) =>
                      setScheduleData({ ...scheduleData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="tt-time-row">
                <div>
                  <label className="tt-label">START TIME</label>
                  <input
                    type="time"
                    className="tt-input"
                    value={scheduleData.startTime}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        startTime: e.target.value,
                      })
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
                      setScheduleData({
                        ...scheduleData,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
               <div className="tt-time-row">
                <div>
                  <label className="tt-label">SubjectName</label>
                  <input
                    className="tt-input"
                    value={teacherProfile.subjectName || ""}
                    disabled
                  />
                </div>
              </div>
               <div className="tt-time-row">
                <div>
                  <label className="tt-label">CLASS</label>
                  <input
                    className="tt-input"
                    value={teacherProfile.className || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="tt-desc-box">
                <label className="tt-label">DESCRIPTION</label>
                <textarea
                  className="tt-textarea"
                  value={scheduleData.description}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="tt-popup-footer">
                <button
                  className="tt-save-btn"
                  onClick={handleSaveSchedule}
                >
                  Save & Prepare Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
