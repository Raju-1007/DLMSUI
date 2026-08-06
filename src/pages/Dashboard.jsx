

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useMessage } from "../context/MessageContext";

export default function Dashboard() {
 const { showSuccess, showError } = useMessage();
  
  const [average, setAverage] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);
const navigate=useNavigate();
const login=useSelector((state)=>state.auth.user);
  useEffect(() => {
   let  progress=localStorage.getItem('progress')
   setAverage(progress);
    
    loadAverage();
    loadCourseCount();
    loadTimetable();
      
     // Load all class schedules
  }, []);
   


  const calendarRef = React.createRef();
const [currentDate, setCurrentDate] = useState("");

// update title when calendar moves
const updateDateTitle = () => {
  const api = calendarRef.current.getApi();
  setCurrentDate(api.currentDataManager.data.viewTitle);
};

// next / prev
const goPrev = () => {
  const api = calendarRef.current.getApi();
  api.prev();
  updateDateTitle();
};

const goNext = () => {
  const api = calendarRef.current.getApi();
  api.next();
  updateDateTitle();
};

// change view
const changeView = (view) => {
  const api = calendarRef.current.getApi();
  if (view === "today") api.today();
  else api.changeView(view);

  updateDateTitle();
};

// run once
useEffect(() => {

  setTimeout(updateDateTitle, 300);
}, []);


  const loadAverage = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/progress/average");
      setAverage(Math.round(res.data));
    } catch (error) {
     showError("Error loading average progress:", error);
    }
  };

  const loadCourseCount = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/content/getCourses");

      const active = res.data.filter((c) => c.subjectName?.trim());
      setCourseCount(active.length);
       
    } catch (error) {
     showError("Error loading courses:", error);
    }
  };


  
 const openTimeTableScreen=()=>{
  setSechuduleShowPopup(true);
    setShowCalendar(false); 
     

 }
 const navigateMyAchievements=()=>{
    navigate("/myachveiemnts")
 }
 const navigateLearningMaterails=()=>{
   navigate("/leraningmaterails")
 }

 const myAttendance=()=>{
  navigate("/myAttendance")
 }

 const navigateMyTimeTable=()=>{
   navigate("/mytimetable")
 }
 const navigateCourses=()=>{
  navigate("/courses")
 }
  const loadTimetable = async () => {
    try {
      const studentId = login.loginId;

      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL +
          `/api/admin/syllabus/student/${studentId}`
      );


      const formattedEvents = res.data.map((t) => ({
        title: `${t.subject}`,
        start: `${t.date}T${t.startTime}`,
        end: `${t.date}T${t.endTime}`,
        backgroundColor: "#06b6d4",
        borderColor: "#06b6d4",
        textColor: "#fff",
        extendedProps: {
          teacher: t.teacherName,
        },
      }));

      setEvents(formattedEvents);
     
    } catch {
      showError("Failed to load timetable");
    }
  };
   console.log(events,"===events====================")
    

  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="dashboard-wrapper">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-sub">Welcome to DLMS. Your courses and progress appear here.</p>

          <div className="dashboard-grid">
            
            {/* CARD 1 */}
            <div className="dashboard-card">
              <h3>Courses</h3>
              <p className="dashboard-number">{courseCount}</p>
              <span  className="status-text">Active</span>
               <button className="dash-arrow" onClick={navigateCourses}>➜</button>
              
            </div>

            {/* CARD 2 */}
            <div className="dashboard-card">
              <h3>Progress</h3>
              <p className="dashboard-number">{average}%</p>
              <span className="status-text">Average</span>
              <button className="dash-arrow">➜</button>
            </div>

            {/* CARD 3 */}
            <div className="dashboard-card">
              <h3>My Achievements</h3>
              <p className="dashboard-number dashboard-orange">8</p>
              <span className="status-text">Certificates</span>
               <button className="dash-arrow"  onClick={navigateMyAchievements}>➜</button>
            </div>

            {/* CARD 4 (TIMETABLE) */}
            <div
              className="dashboard-card timetable-card">
              
              <h3>My Timetable</h3><br></br>
              <span className="status-text3">Hover here to view schedule</span>
               <button className="dash-arrow" onClick={navigateMyTimeTable}>➜</button>
            </div>

            {/* CARD 5 */}
            <div className="dashboard-card">
              <h3>My Attendance</h3>
              <p className="dashboard-number">95%</p>
              <span className="status-text">Tracker</span>
              <button className="dash-arrow" onClick={myAttendance}>➜</button>
            </div>

            {/* CARD 6 */}
            <div className="dashboard-card">
              <h3>Learning Material</h3>
              <ul className="status-text1">
                <li>Books</li>
                <li>Videos</li>
                <li>Quizzes</li>
              </ul>
              
              <button  className="dash-arrow" onClick={navigateLearningMaterails}>➜</button>
              
            </div>

            {/* CARD 7 */}
             <div
      className="dashboard-card notification-full"
      onClick={() => navigate("/notifications")}
      style={{ cursor: "pointer" }}
    >
      <h3>Notifications</h3>
      <p className="dashboard-number">08</p>
                    
     <button className="dash-arrow">➜</button>
    </div>

          </div>
        </div>
      </div>

      {/* ====================== POPUP TIMETABLE ===================== */}
      {showCalendar && (
    
  <div className="calendar-overlay" onMouseLeave={() => setShowCalendar(false)}>
    <div className="calendar-box" onMouseEnter={() => setShowCalendar(true)}>
         <div className="scheduleButton">
        <button className="buttonSchedule" onClick={openTimeTableScreen}>Schedule My Timeline</button>
      </div>
      <h2 className="calendar-header">My Timetable & Schedule</h2>
      

      {/* ⭐ MANUAL CALENDAR HEADER ⭐ */}
      <div className="manual-header">
        <div className="left-section">
          <span className="date-text">{currentDate}</span>

          <button className="nav-btn" onClick={goPrev}>◀</button>
          <button className="nav-btn" onClick={goNext}>▶</button>
        </div>

        <div className="right-section">
          <button className="view-btn" onClick={() => changeView("today")}>Today</button>
          <button className="view-btn" onClick={() => changeView("dayGridMonth")}>Month</button>
          <button className="view-btn" onClick={() => changeView("timeGridWeek")}>Week</button>
          <button className="view-btn" onClick={() => changeView("timeGridDay")}>Day</button>
          <button className="view-btn" onClick={() => changeView("listWeek")}>List</button>
        </div>
      </div>

    </div>
  </div>
)}




       {/* <ChatWidget /> */}
    </div>
  );
}
