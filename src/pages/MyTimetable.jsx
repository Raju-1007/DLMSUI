// // src/pages/MyTimetable.jsx
// import React, { useEffect, useRef, useState } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import axios from "axios";

// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import listPlugin from "@fullcalendar/list";



// export default function MyTimetable() {
//   const calendarRef = useRef(null);

//   const [events, setEvents] = useState([]);
//   const [currentDate, setCurrentDate] = useState("");
//   const [showSchedulePopup, setShowSchedulePopup] = useState(false);
//   const [showEventPopup, setShowEventPopup] = useState(false);
//   const [eventData, setEventData] = useState(null);

//   // ---------- hard-coded fallback events ----------
//   const fallbackEvents = [
//     {
//       title: "Mathematics Class",
//       start: "2025-11-27T10:00:00",
//       end: "2025-11-27T11:00:00",
//       description:
//         "Use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.",
//       backgroundColor: "#00bcd4",
//       borderColor: "#00bcd4",
//       textColor: "#ffffff",
//     },
//     {
//       title: "Science Revision",
//       start: "2025-11-27T17:30:00",
//       end: "2025-11-27T19:00:00",
//       description: "Science revision for Chapter 5 and 6.",
//       backgroundColor: "#00bcd4",
//       borderColor: "#00bcd4",
//       textColor: "#ffffff",
//     },
//   ];

//   // ---------- load from API (with fallback) ----------
//   useEffect(() => {
//     const loadTimetable = async () => {
//       try {
//         const res = await axios.get(
//           import.meta.env.VITE_API_BASE_URL+"/api/timetable/all"
//         );

//         const list = Array.isArray(res.data) ? res.data : [];

//         if (!list.length) {
//           // no data -> fallback
//           setEvents(fallbackEvents);
//           return;
//         }

//         const mapped = list.map((t) => ({
//           title: t.title,
//           start: `${t.date}T${t.startTime}`,
//           end: `${t.date}T${t.endTime}`,
//           description:
//             t.description ||
//             "Use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.",
//           backgroundColor: "#00bcd4",
//           borderColor: "#00bcd4",
//           textColor: "#ffffff",
//         }));

//         setEvents(mapped);
//       } catch(err) {
//        showError("Error loading timetable, using fallback:", err);
//         setEvents(fallbackEvents);
//       }
//     };

//     loadTimetable();
//   }, []);

//   // ---------- header controls ----------
//   const goPrev = () => {
//     const api = calendarRef.current?.getApi();
//     if (!api) return;
//     api.prev();
//   };

//   const goNext = () => {
//     const api = calendarRef.current?.getApi();
//     if (!api) return;
//     api.next();
//   };

//   const changeView = (view) => {
//     const api = calendarRef.current?.getApi();
//     if (!api) return;

//     if (view === "today") api.today();
//     else api.changeView(view);
//   };

//   // ---------- event click -> blue popup ----------
//   const handleEventClick = (info) => {
//     setEventData({
//       title: info.event.title,
//       start: info.event.start,
//       end: info.event.end,
//       description:
//         info.event.extendedProps.description ||
//         "Use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.",
//     });
//     setShowEventPopup(true);
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="page-grid">
//         <Sidebar />

//         <div className="tt-wrapper">
//           {/* PAGE TITLE & TOP BUTTON */}
//           <div className="tt-top-row">
//             <h2 className="tt-page-title">My Timetable &amp; Schedule</h2>

//             <button
//               className="tt-schedule-btn"
//               onClick={() => setShowSchedulePopup(true)}
//             >
//               Schedule My Timeline
//             </button>
//           </div>

//           {/* MAIN CARD */}
//           <div className="tt-card">
//             {/* CUSTOM HEADER (DATE + ARROWS + VIEW TABS) */}
//             <div className="tt-header-bar">
//               <div className="tt-header-left">
//                 <span className="tt-date-text">{currentDate}</span>
//                 <button className="tt-nav-btn" onClick={goPrev}>
//                   ◀
//                 </button>
//                 <button className="tt-nav-btn" onClick={goNext}>
//                   ▶
//                 </button>
//               </div>

//               <div className="tt-header-right">
//                 <button
//                   className="tt-view-btn"
//                   onClick={() => changeView("today")}
//                 >
//                   Today
//                 </button>
//                 <button
//                   className="tt-view-btn"
//                   onClick={() => changeView("dayGridMonth")}
//                 >
//                   Month
//                 </button>
//                 <button
//                   className="tt-view-btn"
//                   onClick={() => changeView("timeGridWeek")}
//                 >
//                   Week
//                 </button>
//                 <button
//                   className="tt-view-btn tt-view-active"
//                   onClick={() => changeView("timeGridDay")}
//                 >
//                   Day
//                 </button>
//                 <button
//                   className="tt-view-btn"
//                   onClick={() => changeView("listWeek")}
//                 >
//                   List
//                 </button>
//               </div>
//             </div>

//             {/* FULLCALENDAR */}
//             <FullCalendar
//               ref={calendarRef}
//               plugins={[
//                 dayGridPlugin,
//                 timeGridPlugin,
//                 interactionPlugin,
//                 listPlugin,
//               ]}
//               initialView="timeGridDay"
//               headerToolbar={false}
//               events={events}
//               height="640px"
//               slotMinTime="09:00:00"
//               slotMaxTime="24:00:00"
//               nowIndicator={true}
//               scrollTime="09:00:00"
//               eventClick={handleEventClick}
//               datesSet={(arg) => setCurrentDate(arg.view.title)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ================= Schedule My Timeline popup (white header) ================= */}
//       {showSchedulePopup && (
//         <div
//           className="tt-popup-overlay"
//           onClick={() => setShowSchedulePopup(false)}
//         >
//           <div
//             className="tt-popup-box"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="tt-popup-header">
//               <h3>Schedule My Timeline</h3>
//               <span
//                 className="tt-popup-close"
//                 onClick={() => setShowSchedulePopup(false)}
//               >
//                 ✕
//               </span>
//             </div>

//             <div className="tt-popup-body">
//               <div className="tt-time-row">
//                 <div>
//                   <label className="tt-label">START TIME</label>
//                   <p>27 November 2025 - 10:00 AM</p>
//                 </div>
//                 <div>
//                   <label className="tt-label">END TIME</label>
//                   <p>27 November 2025 - 11:00 AM</p>
//                 </div>
//               </div>

//               <div className="tt-desc-box">
//                 <label className="tt-label">DESCRIPTION</label>
//                 <p>
//                   Use a passage of Lorem Ipsum, you need to be sure there isn’t
//                   anything embarrassing hidden.
//                 </p>
//               </div>

//               <div className="tt-subject-row">
//                 <label>
//                   <input type="checkbox" /> Mathematics
//                 </label>
//                 <label>
//                   <input type="checkbox" /> Science
//                 </label>
//                 <label>
//                   <input type="checkbox" /> Social
//                 </label>
//                 <label>
//                   <input type="checkbox" /> English
//                 </label>
//               </div>

//               <div className="tt-popup-footer">
//                 <button
//                   className="tt-save-btn"
//                   onClick={() => setShowSchedulePopup(false)}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= Event details popup (BLUE header like your second image) ================= */}
//       {showEventPopup && eventData && (
//         <div
//           className="tt-popup-overlay"
//           onClick={() => setShowEventPopup(false)}
//         >
//           <div
//             className="tt-popup-box"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="tt-popup-header tt-popup-header-blue">
//               <h3>{eventData.title}</h3>
//               <span
//                 className="tt-popup-close"
//                 onClick={() => setShowEventPopup(false)}
//               >
//                 ✕
//               </span>
//             </div>

//             <div className="tt-popup-body">
//               <div className="tt-time-row">
//                 <div>
//                   <label className="tt-label">START TIME</label>
//                   <p>{eventData.start.toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <label className="tt-label">END TIME</label>
//                   <p>{eventData.end.toLocaleString()}</p>
//                 </div>
//               </div>

//               <div className="tt-desc-box">
//                 <label className="tt-label">DESCRIPTION</label>
//                 <p>{eventData.description}</p>
//               </div>

//               <label className="tt-label">
//                 <input type="checkbox" style={{ marginRight: 8 }} />
//                 Remind Me
//               </label>

//               <div className="tt-popup-footer">
//                 <button
//                   className="tt-save-btn"
//                   onClick={() => setShowEventPopup(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








// src/pages/MyTimetable.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useMessage } from "../context/MessageContext"; 
import { useSelector } from "react-redux";


export default function MyTimetable() {
  const calendarRef = useRef(null);
  const { showSuccess, showError } = useMessage();
 

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [initialDate, setInitialDate] = useState(null);

  const [showEventPopup, setShowEventPopup] = useState(false);
  const [eventData, setEventData] = useState(null);

  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
 let login=useSelector((state)=>state.auth.user);
 const [studentsIds, setStudentsIds] = useState([]);
 const [selectedEvent, setSelectedEvent] = useState(null);


  // --------------------------------------------------
  // HARD-CODED FALLBACK EVENTS
  // --------------------------------------------------
  const fallbackEvents = [
    {
      title: "Mathematics Class",
      start: "2025-11-27T10:00:00", // 10 AM
      end: "2025-11-27T11:00:00",
      description:
        "Use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden.",
      backgroundColor: "#01b7f0",
      borderColor: "#01b7f0",
      textColor: "#ffffff",
    },
    {
      title: "Science Class",
      start: "2025-11-27T17:30:00",
      end: "2025-11-27T19:00:00",
      description: "Science revision chapter 5.",
      backgroundColor: "#00b894",
      borderColor: "#00b894",
      textColor: "#ffffff",
    },
  ];

  // helper: set events and initial date
  const applyEvents = (arr) => {
    setEvents(arr);
    if (arr.length > 0) {
      const firstStart = arr[0].start;
      const dateOnly =
        typeof firstStart === "string"
          ? firstStart.split("T")[0]
          : firstStart.toISOString().split("T")[0];
      setInitialDate(dateOnly);
    }
  };

  // --------------------------------------------------
  // LOAD TIMETABLE (API + FALLBACK)
  // --------------------------------------------------
  useEffect(() => {
    getStudentIds();
  const loadTimetable = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +`/api/admin/syllabus/student/${login.loginId}`
      );

      // 🔑 remove duplicates
      const uniqueMap = new Map();
      res.data.forEach((t) => {
        const key = `${t.date}-${t.startTime}-${t.endTime}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, t);
        }
      });
      console.log(uniqueMap,"uniqueMapuniqueMap+++++");

      const formattedEvents = Array.from(uniqueMap.values()).map((t) => ({
        id: `${t.date}-${t.startTime}`,
        title: t.subject,
        start: `${t.date}T${t.startTime}`,
        end: `${t.date}T${t.endTime}`,
       backgroundColor: t.type === "CLASS" ? "#4f46e5" : "#ec4899",
        borderColor: "transparent",
  textColor: "#fff",
        extendedProps: {
          teacher: t.teacherName,
        },
      }));

      // ✅ If API returns empty array
      if (formattedEvents.length === 0) {
        applyEvents(fallbackEvents);
      } else {
        applyEvents(formattedEvents);
      }

    } catch (err) {
      console.error("Error loading timetable:", err);
      showError("Error loading timetable, using fallback");
      applyEvents(fallbackEvents);
    }
  };

  if (login?.loginId) {
    loadTimetable();
  }
}, [login?.loginId]);

  // --------------------------------------------------
  // FULLCALENDAR CONTROLS
  // --------------------------------------------------
  const goPrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.prev();
  };

  const goNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.next();
  };

  const changeView = (view) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (view === "today") api.today();
    else api.changeView(view);
  };

  const handleSaveSchedule = async () => {
  if (
    !scheduleData.date ||
    !scheduleData.startTime ||
    !scheduleData.endTime
  ) {
    return showError("Please select date and time");
  }

  const payload = {
    studentId: login.loginid, // 🔑 student based
    date: scheduleData.date,
    startTime: scheduleData.startTime,
    endTime: scheduleData.endTime,
    description: scheduleData.description,
    duration: calculateDuration(),
    remind: scheduleData.remind,
  };

  try {
    await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/api/student/meeting/schedule",
      payload
    );

    showSuccess("Meeting scheduled successfully");
    setShowSchedulePopup(false);
  } catch (err) {
    showError("Failed to schedule meeting");
  }
};
const handleScheduleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setScheduleData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
const [scheduleData, setScheduleData] = useState({
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  remind: false,
});

const calculateDuration = () => {
  if (!scheduleData.startTime || !scheduleData.endTime) return "";
  const start = new Date(`1970-01-01T${scheduleData.startTime}`);
  const end = new Date(`1970-01-01T${scheduleData.endTime}`);
  const diff = (end - start) / 60000;
  if (diff <= 0) return "";
  return `${diff} minutes`;
};
const getStudentIds = async () => {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL +
        "/api/roles/studentGetDataAttendance"
    );
    setStudentsIds(res.data || []);
  } catch {
    setStudentsIds([]);
  }
};



  // --------------------------------------------------
  // CLICK ON EVENT -> POPUP
  // --------------------------------------------------
  const handleEventClick = (info) => {
    setEventData({
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description:
        info.event.extendedProps.description || "No description available",
    });
    setShowEventPopup(true);
  };

  return (
    <div>
      <Navbar />

      <div className="page-grid">
        <Sidebar />

        <div className="tt-wrapper">
          {/* Top title row with Schedule button */}
          <div className="tt-top-row">
            <h2 className="tt-page-title">My Timetable &amp; Schedule</h2>

             {/* <button
              className="tt-schedule-btn"
              onClick={() => setShowSchedulePopup(true)}
            >
              Schedule My Timeline
            </button>  */}
          </div>

          {/* Main calendar card */}
          <div className="tt-card">
            {/* Header bar: date + arrows + view buttons */}
            <div className="tt-header-bar">
              <div className="tt-header-left">
                <span className="tt-date-text">{currentDate}</span>
                <button className="tt-nav-btn" onClick={goPrev}>
                  ◀
                </button>
                <button className="tt-nav-btn" onClick={goNext}>
                  ▶
                </button>
              </div>

              <div className="tt-header-right">
                <button
                  className="tt-view-btn"
                  onClick={() => changeView("today")}
                >
                  Today
                </button>
                <button
                  className="tt-view-btn"
                  onClick={() => changeView("dayGridMonth")}
                >
                  Month
                </button>
                <button
                  className="tt-view-btn"
                  onClick={() => changeView("timeGridWeek")}
                >
                  Week
                </button>
                <button
                  className="tt-view-btn tt-view-active"
                  onClick={() => changeView("timeGridDay")}
                >
                  Day
                </button>
                <button
                  className="tt-view-btn"
                  onClick={() => changeView("listWeek")}
                >
                  List
                </button>
              </div>
            </div>

            {/* Calendar itself */}
            {initialDate && (
              <FullCalendar
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                initialView="timeGridDay"
                initialDate={initialDate} // ⭐ show 27-11-2025 first
                headerToolbar={false}
                events={events}
                height="650px"
                slotMinTime="09:00:00"
                slotMaxTime="24:00:00"
                nowIndicator={true}
                scrollTime="09:00:00"
                eventClick={handleEventClick}
                 eventTimeFormat={{
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
  }}
  dayMaxEvents={3}
                datesSet={(arg) => setCurrentDate(arg.view.title)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= Schedule My Timeline popup ================= */}
      {showSchedulePopup && (
  <div className="tt-popup-overlay" onClick={() => setShowSchedulePopup(false)}>
    <div className="tt-popup-box" onClick={(e) => e.stopPropagation()}>
      
      <div className="tt-popup-header">
        <h3>Schedule Meeting</h3>
        <span className="tt-popup-close" onClick={() => setShowSchedulePopup(false)}>
          ✕
        </span>
      </div>

      <div className="tt-popup-body">

        <div className="tt-time-row">
          <div>
            <label className="tt-label">DATE</label>
            <input
              type="date"
              name="date"
              value={scheduleData.date}
              onChange={handleScheduleChange}
              className="tt-input"
            />
          </div>
        </div>

        <div className="tt-time-row">
          <div>
            <label className="tt-label">START TIME</label>
            <input
              type="time"
              name="startTime"
              value={scheduleData.startTime}
              onChange={handleScheduleChange}
              className="tt-input"
            />
          </div>

          <div>
            <label className="tt-label">END TIME</label>
            <input
              type="time"
              name="endTime"
              value={scheduleData.endTime}
              onChange={handleScheduleChange}
              className="tt-input"
            />
          </div>
        </div>

        <div className="tt-duration">
          <label className="tt-label">DURATION</label>
          <p>{calculateDuration() || "--"}</p>
        </div>
        <div className="tt-time-row">
  <div>
    <label className="tt-label">STUDENT</label>
    <select
      name="studentId"
      value={scheduleData.studentId}
      onChange={handleScheduleChange}
      className="tt-input"
    >
      <option value="">Select Student</option>

      {/* Logged-in student */}
      <option value={login.loginid}>
        My Self ({login.loginid})
      </option>

      {/* Other students */}
      {studentsIds.map((stu) => (
        <option key={stu.id} value={stu.id}>
          {stu.fullName} ({stu.loginid})
        </option>
      ))}
    </select>
  </div>
</div>


        <div className="tt-desc-box">
          <label className="tt-label">DESCRIPTION</label>
          <textarea
            name="description"
            value={scheduleData.description}
            onChange={handleScheduleChange}
            className="tt-textarea"
            placeholder="Enter meeting details..."
          />
        </div>

        <label className="tt-remind">
          <input
            type="checkbox"
            name="remind"
            checked={scheduleData.remind}
            onChange={handleScheduleChange}
          />
          Remind Me
        </label>

        <div className="tt-popup-footer">
          <button className="tt-save-btn" onClick={handleSaveSchedule}>
            Save Meeting
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* ================= Event details popup ================= */}
      {showEventPopup && eventData && (
        <div
          className="tt-popup-overlay"
          onClick={() => setShowEventPopup(false)}
        >
          <div
            className="tt-popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tt-popup-header tt-popup-header-blue">
              <h3>{eventData.title}</h3>
              <span
                className="tt-popup-close"
                onClick={() => setShowEventPopup(false)}
              >
                ✕
              </span>
            </div>

            <div className="tt-popup-body">
              <div className="tt-time-row">
                <div>
                  <label className="tt-label">START TIME</label>
                  <p>{eventData.start.toLocaleString()}</p>
                </div>
                <div>
                  <label className="tt-label">END TIME</label>
                  <p>{eventData.end.toLocaleString()}</p>
                </div>
              </div>

              <div className="tt-desc-box">
                <label className="tt-label">DESCRIPTION</label>
                <p>{eventData.description}</p>
              </div>

              <label className="tt-remind">
                <input type="checkbox" /> Remind Me
              </label>

              <div className="tt-popup-footer">
                <button
                  className="tt-save-btn"
                  onClick={() => setShowEventPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// import 'whatwg-fetch';
// import React from 'react';
// import Scheduler from 'devextreme-react/scheduler';
// import { CustomStore } from 'devextreme-react/common/data';

// const getData = async (_, requestOptions) => {
//   const GOOGLE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/';
//   const CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';
//   const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k';
//   const dataUrl = [GOOGLE_CALENDAR_URL, CALENDAR_ID, '/events?key=', PUBLIC_KEY].join('');
//   const response = await fetch(dataUrl, requestOptions);
//   const data = await response.json();
//   return data.items;
// };
// const dataSource = new CustomStore({
//   load: (options) => getData(options, { showDeleted: false }),
// });
// const currentDate = new Date(2017, 4, 25);
// const views = ['day', 'workWeek', 'month'];
// const App = () => (
//   <React.Fragment>
//     <div className="long-title">
//       <h3>Tasks for Employees (USA Office)</h3>
//     </div>
//     <Scheduler
//       dataSource={dataSource}
//       views={views}
//       defaultCurrentView="workWeek"
//       defaultCurrentDate={currentDate}
//       height={500}
//       startDayHour={7}
//       editing={false}
//       showAllDayPanel={false}
//       startDateExpr="start.dateTime"
//       endDateExpr="end.dateTime"
//       textExpr="summary"
//       timeZone="America/Los_Angeles"
//     />
//   </React.Fragment>
// );
// export default App;

