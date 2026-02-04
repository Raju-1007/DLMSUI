import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext";
import { useLocation } from "react-router-dom";
import axios from "axios";


const localizer = dayjsLocalizer(dayjs);

const Calnderview = () => {

  const { showSuccess, showError } = useMessage();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
 let login=useSelector((state)=>state.auth.user);
 const [selectedEvent, setSelectedEvent] = useState(null);

 const [viewEvent, setViewEvent] = useState(null)
  const location = useLocation();

 
  let teacherDetails=location.state.data;
 const [studentsIds, setStudentsIds] = useState([]);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    studentId: "",
    description: "",
    remind: false,
  });

  const [slotInfo, setSlotInfo] = useState(null);

  const students = [
    { id: 1, name: "Student A" },
    { id: 2, name: "Student B" },
  ];

  // Slot selection
  const handleSelectSlot = ({ start, end }) => {
    setSlotInfo({ start, end });

    setForm({
      date: dayjs(start).format("YYYY-MM-DD"),
      startTime: dayjs(start).format("HH:mm"),
      endTime: dayjs(end).format("HH:mm"),
      studentId: "",
      description: "",
      remind: false,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Duration calculation
  const duration = () => {
    if (!form.startTime || !form.endTime) return "--";
    const start = dayjs(`2024-01-01 ${form.startTime}`);
    const end = dayjs(`2024-01-01 ${form.endTime}`);
    return `${end.diff(start, "minute")} mins`;
  };

  // const saveMeeting = () => {
  //   const start = dayjs(`${form.date} ${form.startTime}`).toDate();
  //   const end = dayjs(`${form.date} ${form.endTime}`).toDate();

  //   setEvents([
  //     ...events,
  //     {
  //       title: "Meeting", 
  //       start,
  //       end,
  //     },
  //   ]);

  //   setShowModal(false);
  // };

  const handleSelectEvent = (event) => {
    
  setSelectedEvent(event);


   

  // setScheduleData({
  //   studentId: event.studentId || "",
  //   date: event.date || dayjs(event.start).format("YYYY-MM-DD"),
  //   startTime: event.startTime || dayjs(event.start).format("HH:mm"),
  //   endTime: event.endTime || dayjs(event.end).format("HH:mm"),
  //   description: event.description || "",
  //   remind: event.remind || false,
  // });

  // setShowModal(true);
};

const handleSaveSchedule = async () => {
  
  const payload = {
     
    date: scheduleData.date,
    startTime: scheduleData.startTime,
    endTime: scheduleData.endTime,
    description: scheduleData.description,
    duration: calculateDuration(),
    remind: scheduleData.remind,
    teacherId:teacherDetails.tecaher_id,
    teacherName:teacherDetails.tecaher_name,
    department:teacherDetails.teacher_department,
    subjects:teacherDetails.teacher_knows_Subjects,
     classNames:teacherDetails.classNames

  };
   console.log(payload,"payload::::::::::::::::");
 const calendarEvent = {
  title: "Meeting",
  start: dayjs(`${payload.date} ${payload.startTime}`).toDate(),
  end: dayjs(`${payload.date} ${payload.endTime}`).toDate(),

  // ✅ ADD THESE
  description: payload.description,
  studentId: payload.studentId,
  remind: payload.remind,
};

    // ✅ IMPORTANT: PUSH INTO ARRAY
    setEvents((prevEvents) => [...prevEvents, calendarEvent]);

  console.log("::::::::::::: :before  Axiouse::::::::::::::::::::::")
  try { await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/notify/api/addMeetings",
      payload
    );

    showSuccess("Meeting scheduled successfully");
    setShowModal(false);
  } catch (err) {
    showError("Failed to schedule meeting");
     setShowModal(false);
  }
};

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
    teacherDetails:"",
    teacherId:"",
    department:"",
    Subject:"",
    teacherEmail:"",
    teacherPhone:"",
    teacherClass:"",

    remind: false,
  });
 
  return (
    <>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="tt-popup-overlay" onClick={() => setShowModal(false)}>
    <div className="tt-popup-box" onClick={(e) => e.stopPropagation()}>
      
      <div className="tt-popup-header">
        <h3>Schedule Meeting</h3>
        <span className="tt-popup-close" onClick={() => setShowModal(false)}>
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
  <div className="tt-teacher-sticky">
    <label className="tt-label">TEACHER DETAILS</label>

    <div className="tt-teacher-grid">
      <div className="tt-field">
        <span>Name</span>
        <p>{teacherDetails.tecaher_name}</p>
      </div>

      <div className="tt-field">
        <span>Teacher ID</span>
        <p>{teacherDetails.tecaher_id}</p>
      </div>

      <div className="tt-field">
        <span>Department</span>
        <p>{teacherDetails.teacher_department}</p>
      </div>

      <div className="tt-field">
        <span>Subject</span>
        <p>{teacherDetails.teacher_knows_Subjects}</p>
      </div>

      <div className="tt-field">
        <span>Email</span>
        <p>{teacherDetails.teacher_Email}</p>
      </div>

      <div className="tt-field">
        <span>Phone</span>
        <p>{teacherDetails.teacher_phoneNumber}</p>
      </div>

      <div className="tt-field full">
        <span>Class</span>
        <p>{teacherDetails.classNames}</p>
      </div>
    </div>
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


      {selectedEvent && (
  <div className="tt-popup-overlay">
    <div className="tt-popup-box tt-view-box">

      {/* HEADER */}
      <div className="tt-view-header">
        <h3>{selectedEvent.title}</h3>
        <span
          className="tt-popup-close"
          onClick={() => setSelectedEvent(null)}
        >
          ✕
        </span>
      </div>

      {/* BODY */}
      <div className="tt-popup-body">

        <div className="tt-time-row">
          <div>
            <label className="tt-label">START TIME</label>
            <p>
              {dayjs(selectedEvent.start).format("DD/MM/YYYY, hh:mm A")}
            </p>
          </div>

          <div>
            <label className="tt-label">END TIME</label>
            <p>
              {dayjs(selectedEvent.end).format("DD/MM/YYYY, hh:mm A")}
            </p>
          </div>
        </div>

        <div className="tt-desc-box">
          <label className="tt-label">DESCRIPTION</label>
          <p>{selectedEvent.description || "--"}</p>
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
          <button
            className="tt-save-btn"
            onClick={() => setSelectedEvent(null)}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Calnderview;
