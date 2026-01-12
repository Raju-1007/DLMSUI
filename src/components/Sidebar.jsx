// import React from 'react';
// import { Link } from 'react-router-dom';
// import { logout, role } from '../lib/auth'; // role() returns 'TEACHER' or 'STUDENT'

// export default function Sidebar() {
//   const userRole = role(); // read role once

//   return (
//     <div
//       style={{
//         width: 220,
//         background: '#fff',
//         borderRight: '1px solid #e5e7eb',
//         padding: 12,
//         position: 'sticky',
//         top: 56,
//         height: 'calc(100vh - 56px)',
//       }}
//     >
//       <div style={{ fontWeight: 700, marginBottom: 12 }}>Navigation</div>

//       <ul
//         style={{
//           listStyle: 'none',
//           padding: 0,
//           display: 'grid',
//           gap: 8,
//         }}
//       >
//         {/* 🧑‍🏫 Teacher-only Links */}
//         {userRole === 'TEACHER' && (
//           <>
//             <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <Link to="/courses">Courses</Link>
//             </li>
//             {/* <li>
//               <Link to="/progress">Progress</Link>
//             </li> */}
//             {/* <li>
//               <Link to="/grades">Gradebook</Link>
//             </li> */}
//             <li>
//               <Link to="/giveassignments">give Assignments to students</Link>
//             </li>
//             <li>
//               <Link to="/notifications">Notifications</Link>
//             </li>
//             <li>
//               <Link to="/help">Help Desk</Link>
//             </li>
//             <li>
//               <Link to="/Assign Grade">Assign Grade</Link>
//             </li>
//              {/* <li>
//               <Link to="/Assigntopic">assigntopics</Link>
//             </li> */}
//           </>
//         )}

//         {/* 🎓 Student-only Links */}
//         {userRole === 'STUDENT' && (
//           <>
//             <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <Link to="/courses">Courses</Link>
//             </li>
//             <li>
//               <Link to="/assignments">Assignments</Link>
//             </li>
//             <li>
//               <Link to="/grades">Gradebook</Link>
//             </li>
//             <li>
//               <Link to="/progress">Progress</Link>
//             </li>
//             <li>
//               <Link to="/notifications">Notifications</Link>
//             </li>
//             <li>
//               <Link to="/help">Help Desk</Link>
//             </li>
//           </>
//         )}
//         {userRole ==='ADMIN'&&(
//           <>
//               <li>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li>
//               <Link to="/courses">Courses</Link>
//             </li>
//             <li>
//               <Link to="/assignments">Assignments</Link>
//             </li>
//             <li>
//               <Link to="/grades">Gradebook</Link>
//             </li>
//             <li>
//               <Link to="/progress">Progress</Link>
//             </li>
//             <li>
//               <Link to="/notifications">Notifications</Link>
//             </li>
//             <li>
//               <Link to="/help">Help Desk</Link>
//             </li>
          

//           </>

//         )}

//         {/* 🚪 Logout Option (common for all) */}
        
//       </ul>
//     </div>
//   );
// }


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout, role } from "../lib/auth";

// Icons
import { 
  MdDashboard, 
  MdAssignment, 
  MdOutlineSchool, 
  MdNotificationsNone,
  MdHelpOutline,
  MdSchedule,
  MdTimelapse,
  MdSettings
} from "react-icons/md";

import { FaBook, FaCalendarAlt, FaUserGraduate, FaUsers, FaUserTie } from "react-icons/fa";


export default function Sidebar() {
  const userRole = role();
  const location = useLocation();

  const menuItems = {
    SUPER_ADMIN:[
         { icon: <MdDashboard />, label: "SuperAdminDashboard", to: "/SuperAdminDashboard" },
         { icon: <FaUserTie />, label: "SystemAnalytics", to: "/SystemAnalyticsPageSuperAdmin" },
          { icon: <FaUserTie />, label: "SuperAdminManagement", to: "/SuperAdminDistrictManagementPage" },
           { icon: <FaUsers />, label: "SuperAdminApproval", to: "/superAdminApproval" },
          
    ],
    ADMIN: [
      { icon: <MdDashboard />, label: "AdminDashboard", to: "/admin/dashboard" },
      // { icon: <FaBook />, label: "Courses", to: "/courses" },
      // { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
      // // { icon: <FaUserGraduate />, label: "Gradebook", to: "/grades" },
      // // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
      // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
      // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" }
       { icon: <FaUsers />, label: "Students", to: "/admin/students" },
    { icon: <FaUserTie />, label: "Teachers", to: "/admin/teachers" },
    { icon: <FaBook />, label: "Courses", to: "/admin/courses" },
    { icon: <FaCalendarAlt />, label: "Timetable", to: "/admin/teacherssyllabus" },
    // { icon: <MdAssignment />, text: "Assignments", to: "/admin/assignments" },
    { icon: <MdTimelapse />, label: "Attendance", to: "/admin/teachersattedance" },
    
   
    { icon: <MdAssignment />, label: "HelpDisk", to: "/admin/helpDisk" },
    { icon: <MdNotificationsNone />, label: "Notifications", to: "/admin/notifications" },
    { icon: <MdSettings />, label: "Settings", to: "/admin/settings" },
    // { icon: <MdSettings />, label: "ManageTecahers", to: "/admin/adminhandileteachers" },
    //  { icon: <MdSettings />, label: "ManageStudents", to: "/admin/AdminManageStudents" },
    ],
    TEACHER: [
      { icon: <MdDashboard />, label: "TeacherDashboard", to: "/teacher/dashboard" },
      // { icon: <FaBook />, label: "Courses", to: "/courses" },
      // { icon: <MdAssignment />, label: "Give Assignments", to: "/giveassignments" },
      // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
      // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
      // { icon: <FaUserGraduate />, label: "Assign Grade", to: "/Assign Grade" }
       { icon: <MdAssignment />, label: "Assignments", to: "/teacher/assignments" },
      { icon: <MdOutlineSchool />, label: "Attendance", to: "/teacher/attendance" },
      { icon: <FaBook />, label: "Materials", to: "/teacher/materials" },
      { icon: <FaUserGraduate />, label: "Gradebook", to: "/teacher/gradebook" },
      { icon: <MdSchedule />, label: "Timetable", to: "/teacher/timetable" },
      { icon: <MdNotificationsNone />, label: "Notifications", to: "/teacher/notifications" },
      { icon: <MdHelpOutline />, label: "Help Desk", to: "/teacher/Helpdisk" },
      { icon: <MdNotificationsNone />, label: "receiveNotifications", to: "/receiveNotifications" },
       { icon: <MdSchedule />, label: "Sechudule Meeting", to: "/mytimetable" },

    
    
      
    ],
    STUDENT: [
      { icon: <MdDashboard />, label: "Dashboard", to: "/dashboard" },
      { icon: <FaBook />, label: "Courses", to: "/courses" },
      { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
       { icon: <FaUserGraduate />, label: "MyGrades", to: "/MyGrades" },
      // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
      { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
      { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
       { icon: <MdTimelapse />, label: " StudentAttendance", to: "/studentAttendance" },

    ]
  };

  return (
    <aside className="sb-container">
      <ul className="sb-menu">
        {menuItems[userRole]?.map((item) => (
          <li
            key={item.to}
            className={`sb-item ${location.pathname === item.to ? "active" : ""}`}
          >
            <Link to={item.to} className="sb-link">
              <span className="sb-icon">{item.icon}</span>
              <span className="sb-text">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

