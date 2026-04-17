

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { logout, role } from "../lib/auth";

// // Icons
// import { 
//   MdDashboard, 
//   MdAssignment, 
//   MdOutlineSchool, 
//   MdNotificationsNone,
//   MdHelpOutline,
//   MdSchedule,
//   MdTimelapse,
//   MdSettings
// } from "react-icons/md";

// import { FaBook, FaCalendarAlt, FaUserGraduate, FaUsers, FaUserTie } from "react-icons/fa";
// import { getDepartmentUpdatePropfileDetails, getStudentUpdatePropfileDetails } from "./LoginActivity";
// import { useSelector } from "react-redux";
// import { useMessage } from "../context/MessageContext";


// export default function Sidebar() {
//   const userRole = role();
//   const location = useLocation();

//   const { showError, showSuccess } = useMessage();

//   const login=useSelector((state)=>state.auth.user);


//    let Studentdata=getStudentUpdatePropfileDetails(login,showSuccess, showError)
//    let Departmentdata=getDepartmentUpdatePropfileDetails(login,showSuccess, showError)

//   const menuItems = {
//     SUPER_ADMIN:[
//          { icon: <MdDashboard />, label: "SuperAdminDashboard", to: "/SuperAdminDashboard" },
//          { icon: <FaUserTie />, label: "SystemAnalytics", to: "/SystemAnalyticsPageSuperAdmin" },
//           { icon: <FaUserTie />, label: "SuperAdminManagement", to: "/SuperAdminDistrictManagementPage" },
//            { icon: <FaUsers />, label: "SuperAdminApproval", to: "/superAdminApproval" },
          
//     ],
//     ADMIN: [
//       { icon: <MdDashboard />, label: "AdminDashboard", to: "/admin/dashboard" },
//       // { icon: <FaBook />, label: "Courses", to: "/courses" },
//       // { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
//       // // { icon: <FaUserGraduate />, label: "Gradebook", to: "/grades" },
//       // // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
//       // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
//       // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" }
//        { icon: <FaUsers />, label: "Students", to: "/admin/students" },
//     { icon: <FaUserTie />, label: "Teachers", to: "/admin/teachers" },
//     { icon: <FaBook />, label: "Courses", to: "/admin/courses" },
//     { icon: <FaCalendarAlt />, label: "Timetable", to: "/admin/teacherssyllabus" },
//     // { icon: <MdAssignment />, text: "Assignments", to: "/admin/assignments" },
//     // { icon: <MdTimelapse />, label: "Attendance", to: "/admin/teachersattedance" },
//      { icon: <FaUsers />, label: "AdminApproval", to: "/adminApproval" },
    
 
//     { icon: <MdAssignment />, label: "HelpDisk", to: "/admin/helpDisk" },
//     { icon: <MdNotificationsNone />, label: "Notifications", to: "/admin/notifications" },
//     { icon: <MdSettings />, label: "Settings", to: "/admin/settings" },
//     // { icon: <MdSettings />, label: "ManageTecahers", to: "/admin/adminhandileteachers" },
//     //  { icon: <MdSettings />, label: "ManageStudents", to: "/admin/AdminManageStudents" },
//     ],
//     TEACHER: [
//       { icon: <MdDashboard />, label: "TeacherDashboard", to: "/teacher/dashboard" },
//       // { icon: <FaBook />, label: "Courses", to: "/courses" },
//       // { icon: <MdAssignment />, label: "Give Assignments", to: "/giveassignments" },
//       // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
//       // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
//       // { icon: <FaUserGraduate />, label: "Assign Grade", to: "/Assign Grade" }
//        { icon: <MdAssignment />, label: "Assignments", to: "/teacher/assignments" },
//       { icon: <MdOutlineSchool />, label: "Attendance", to: "/teacher/attendance" },
//       { icon: <FaBook />, label: "Materials", to: "/teacher/materials" },
//       { icon: <FaUserGraduate />, label: "Gradebook", to: "/teacher/gradebook" },
//       // { icon: <MdSchedule />, label: "SechduleMeetings", to: "/teacher/timetable" },
//       { icon: <MdNotificationsNone />, label: "Notifications", to: "/teacher/notifications" },
//       { icon: <MdHelpOutline />, label: "Help Desk", to: "/teacher/Helpdisk" },
//       { icon: <MdNotificationsNone />, label: "MY Notifications", to: "/receiveNotifications" },
//       //  { icon: <MdSchedule />, label: "Sechudule Meeting", to: "/mytimetable" },

    
    
      
//     ],
//     STUDENT: [
//       { icon: <MdDashboard />, label: "Dashboard", to: "/dashboard" },
//       { icon: <FaBook />, label: "Courses", to: "/courses" },
//       // { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
//        { icon: <FaUserGraduate />, label: "MyGrades", to: "/MyGrades" },
//       // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
//       { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
//       { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
//        { icon: <MdTimelapse />, label: " My Attendance", to: "/studentAttendance" },
//        { icon: <MdSchedule />, label: "MyTimetable", to: "/studenttimeTable" },

       

//     ]
//   };

//   return (
//     <aside className="sb-container">
//       <ul className="sb-menu">
//         {menuItems[userRole]?.map((item) => (
//           <li
//             key={item.to}
//             className={`sb-item ${location.pathname === item.to ? "active" : ""}`}
//           >
//             <Link to={item.to} className="sb-link">
//               <span className="sb-icon">{item.icon}</span>
//               <span className="sb-text">{item.label}</span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { role } from "../lib/auth";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext";
import {
  getDepartmentUpdatePropfileDetails,
  getStudentUpdatePropfileDetails
} from "./LoginActivity";

import { 
  MdDashboard, 
  MdAssignment, 
   MdOutlineSchool, 
  MdNotificationsNone,
  MdHelpOutline,
  MdSchedule,
 MdTimelapse,
 MdSettings,
 

 } from "react-icons/md";
import { FaBook, FaCalendarAlt, FaUserGraduate, FaUsers, FaUserTie } from "react-icons/fa";

export default function Sidebar() {

  const userRole = role();
  const location = useLocation();
  const navigate = useNavigate();
  const login = useSelector((state) => state.auth.user);
  const { showError } = useMessage();

  const [profileValid, setProfileValid] = useState(null);

  /* ================= PROFILE VALIDATION ================= */

  useEffect(() => {
    const checkProfile = async () => {
      try {

        if (userRole === "STUDENT") {
          const res = await getStudentUpdatePropfileDetails(login);
          console.log("Profile Validity Response  sidebar:", res);
          setProfileValid(res);
        }

        else if (userRole === "ADMIN" || userRole === "TEACHER" || userRole === "SUPER_ADMIN") {
          const res = await getDepartmentUpdatePropfileDetails(login);
          console.log("Profile Validity Response  sidebar:", res.data);
          setProfileValid(res);
        }

       

      } catch {
        setProfileValid(false);
      }
    };

    checkProfile();
  }, [login]);

  /* ================= CLICK HANDLER ================= */

  const handleNavigation = (e, path) => {
    console.log("Profile Validity on Navigation Attempt:", profileValid);

    if (!profileValid  ||  profileValid == null  || profileValid == "null" || profileValid == "undefined" || profileValid === undefined) {
      e.preventDefault();
      showError("Please update the profile");
      return;
    }

    navigate(path);
  };

  /* ================= MENU ITEMS ================= */

  const menuItems = {
    STUDENT: [
      { icon: <MdDashboard />, label: "Dashboard", to: "/dashboard" },
       { icon: <FaBook />, label: "Courses", to: "/courses" },
//       // { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
      { icon: <FaUserGraduate />, label: "MyGrades", to: "/MyGrades" },
//       // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
      { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
      { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
       { icon: <MdTimelapse />, label: " My Attendance", to: "/studentAttendance" },
       { icon: <MdSchedule />, label: "MyTimetable", to: "/studenttimeTable" },
    ],

    ADMIN: [
           { icon: <MdDashboard />, label: "AdminDashboard", to: "/admin/dashboard" },
//       // { icon: <FaBook />, label: "Courses", to: "/courses" },
//       // { icon: <MdAssignment />, label: "Assignments", to: "/assignments" },
//       // // { icon: <FaUserGraduate />, label: "Gradebook", to: "/grades" },
//       // // { icon: <MdOutlineSchool />, label: "Progress", to: "/progress" },
//       // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
//       // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" }
      { icon: <FaUsers />, label: "Students", to: "/admin/students" },
     { icon: <FaUserTie />, label: "Teachers", to: "/admin/teachers" },
     { icon: <FaBook />, label: "Courses", to: "/admin/courses" },
    { icon: <FaCalendarAlt />, label: "Timetable", to: "/admin/teacherssyllabus" },
//     // { icon: <MdAssignment />, text: "Assignments", to: "/admin/assignments" },
//     // { icon: <MdTimelapse />, label: "Attendance", to: "/admin/teachersattedance" },
    { icon: <FaUsers />, label: "AdminApproval", to: "/adminApproval" },
    
 
    { icon: <MdAssignment />, label: "HelpDisk", to: "/admin/helpDisk" },
   { icon: <MdNotificationsNone />, label: "Notifications", to: "/admin/notifications" },
    { icon: <MdSettings />, label: "Settings", to: "/admin/settings" },
//     // { icon: <MdSettings />, label: "ManageTecahers", to: "/admin/adminhandileteachers" },
//     //  { icon: <MdSettings />, label: "ManageStudents", to: "/admin/AdminManageStudents" },
    ],

    TEACHER: [
       { icon: <MdDashboard />, label: "TeacherDashboard", to: "/teacher/dashboard" },
      // // { icon: <FaBook />, label: "Courses", to: "/courses" },
      // // { icon: <MdAssignment />, label: "Give Assignments", to: "/giveassignments" },
      // // { icon: <MdNotificationsNone />, label: "Notifications", to: "/notifications" },
      // // { icon: <MdHelpOutline />, label: "Help Desk", to: "/help" },
      // // { icon: <FaUserGraduate />, label: "Assign Grade", to: "/Assign Grade" }
       { icon: <MdAssignment />, label: "Assignments", to: "/teacher/assignments" },
       { icon: <MdOutlineSchool />, label: "Attendance", to: "/teacher/attendance" },
      { icon: <FaBook />, label: "Materials", to: "/teacher/materials" },
      { icon: <FaUserGraduate />, label: "Gradebook", to: "/teacher/gradebook" },
      // { icon: <MdSchedule />, label: "SechduleMeetings", to: "/teacher/timetable" },
      { icon: <MdNotificationsNone />, label: "Notifications", to: "/teacher/notifications" },
       { icon: <MdHelpOutline />, label: "Help Desk", to: "/teacher/Helpdisk" },
       { icon: <MdNotificationsNone />, label: "MY Notifications", to: "/receiveNotifications" },
      //  { icon: <MdSchedule />, label: "Sechudule Meeting", to: "/mytimetable" },
    ],

    SUPER_ADMIN: [
       { icon: <MdDashboard />, label: "SuperAdminDashboard", to: "/SuperAdminDashboard" },
         { icon: <FaUserTie />, label: "SystemAnalytics", to: "/SystemAnalyticsPageSuperAdmin" },
          { icon: <FaUserTie />, label: "SuperAdminManagement", to: "/SuperAdminDistrictManagementPage" },
           { icon: <FaUsers />, label: "SuperAdminApproval", to: "/superAdminApproval" },
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
            <Link
              to={item.to}
              className="sb-link"
              onClick={(e) => handleNavigation(e, item.to)}
            >
              {item.label}
            </Link>
          </li>
        ))}

      </ul>
    </aside>
  );
}